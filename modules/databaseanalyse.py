import sqlite3
import os
import json
import sys
from analyze import run_full_analysis, analyze_text_from_webm
from openai import OpenAI
import re
from scoring import compute_final_scores  # Your scoring logic
import psycopg2

# === CONFIGURATION ===
VIDEO_FOLDER = r"C:\Users\LOQ\Documents\code\NLPIP\web\storage\video"
KEYWORDS = ["healthcare", "education", "intelligence", "policy"]
OPENROUTER_API_KEY = "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"

# === Initialize DeepSeek Client ===
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)



import re
import json


def ask_deepseek(question, answer, retries=2):
    prompt = f"""
You are an interview evaluator. Given a question and a candidate's answer (spoken or code), generate:
- An improved version of the answer
- Accuracy score (0–100)
- Completeness score (0–100)
- Depth of knowledge score (0–100)

Reply with only the following XML-style format and no other explanation or formatting:

<improvised_answer>...</improvised_answer>
<answer_accuracy>...</answer_accuracy>
<answer_completeness>...</answer_completeness>
<depth_of_knowledge>...</depth_of_knowledge>

Question: {question}

Answer: {answer}
"""

    for attempt in range(1, retries + 1):
        try:
            print(f"\n[DEBUG] Sending prompt to DeepSeek (attempt {attempt}):\n{prompt}\n")

            completion = client.chat.completions.create(
                model="deepseek/deepseek-r1-0528:free",
                messages=[{"role": "user", "content": prompt}],
                extra_headers={
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "NLPIP Analyzer"
                }
            )

            content = completion.choices[0].message.content.strip()
            print(f"[DEBUG] Raw response from DeepSeek (attempt {attempt}):\n{content}\n")

            # Extract values using regex
            def extract(tag):
                match = re.search(f"<{tag}>(.*?)</{tag}>", content, re.DOTALL)
                return match.group(1).strip() if match else None

            result = {
                "improvised_answer": extract("improvised_answer"),
                "answer_accuracy": int(extract("answer_accuracy") or 0),
                "answer_completeness": int(extract("answer_completeness") or 0),
                "depth_of_knowledge": int(extract("depth_of_knowledge") or 0),
            }

            if result["improvised_answer"] is not None:
                return result
            else:
                print("[WARNING] Some tags were missing in response.")

        except Exception as e:
            print(f"[WARNING] DeepSeek API failed (attempt {attempt}): {e}")

    return None




def analyze_questions(interview_id=None):
   

    # New
    conn = psycopg2.connect(
        dbname="mock_interview_db",
        user="mockuser",
        password="user@pass",
        host="localhost",
        port=5432
    )
    cursor = conn.cursor()

    # === 1. Spoken Questions NLP + DeepSeek ===
    spoken_query = """
        SELECT id, video_path, question_text
        FROM interview_questions
        WHERE question_type = 'spoken'
        AND speech_rate_wpm IS NULL
    """
    if interview_id:
        spoken_query += " AND interview_id = %s"
        cursor.execute(spoken_query, (interview_id,))
    else:
        cursor.execute(spoken_query)



    spoken_questions = cursor.fetchall()
    print(f"[INFO] Found {len(spoken_questions)} spoken questions for full analysis.")

    for q_id, video_filename, question_text in spoken_questions:
        full_path = os.path.join(VIDEO_FOLDER, video_filename)
        print(f"\n[DEBUG] Processing Spoken Question ID {q_id}")
    
        if not os.path.exists(full_path):
            print(f"[WARNING] Video file not found: {full_path}. Skipping.")
            continue
        
        try:
            # Step 1: Analyze audio/NLP
            result = run_full_analysis(full_path, domain_keywords=KEYWORDS, verbose=False)
    
            # Step 2: Transcribe
            try:
                transcribed_result = analyze_text_from_webm(full_path)
                print("[DEBUG] this is transcribed 1",transcribed_result)
                if isinstance(transcribed_result, dict):
                    transcribed = transcribed_result.get("transcribed_text", "").strip()
                else:
                    transcribed = str(transcribed_result).strip()
                print("[DEBUG] this is transcribed after stripping",transcribed_result)
            except Exception as e:
                print(f"[ERROR] Transcription failed: {e}")
                transcribed = ""
    
            # Step 3: Ask Gemini (even if empty)
            gemini_data = None
            if not transcribed:
                print("[DEBUG] going with no answer")
                fallback = ask_deepseek(question_text, "")
                print(fallback)
                if fallback:
                    gemini_data = {
                        "improvised_answer": fallback.get("improvised_answer"),
                        "answer_accuracy": 0,
                        "answer_completeness": 0,
                        "depth_of_knowledge": 0
                    }
            else:
                print("[DEBUG] got ans",transcribed)
                gemini_data = ask_deepseek(question_text, transcribed)
    
            # Step 4: Prepare DB update
            columns = []
            values = []
    
            # Only update columns that exist in the schema
            valid_result_keys = {
                'speech_rate_wpm', 'pause_ratio', 'tempo_variation',
                'avg_pitch', 'pitch_variation', 'prosody_slope', 'jitter', 'shimmer',
                'loudness', 'energy_variability', 'formant_f1', 'formant_f2',
                'type_token_ratio', 'advanced_vocab_words', 'advanced_vocab_usage',
                'redundant_words', 'keyword_matches', 'keyword_density',
                'pronoun_usage_count', 'pronoun_density', 'function_word_density',
                'lexical_sophistication_index', 'grammar_issues', 'readability_score',
                'syllables_per_word', 'tense_consistency'
            }
            
            for key, value in result.items():
                if key not in valid_result_keys:
                    print(f"[WARNING] Skipping unexpected analysis key: {key}")
                    continue
                columns.append(f"{key} = ?")
                values.append(json.dumps(value) if isinstance(value, (list, dict)) else value)
            
    
            # Optional: Add Gemini metrics only if available
            if gemini_data:
                columns += [
                    "improvised_answer = ?",
                    "answer_accuracy = ?",
                    "answer_completeness = ?",
                    "depth_of_knowledge = ?"
                ]
                values += [
                    gemini_data.get("improvised_answer"),
                    gemini_data.get("answer_accuracy"),
                    gemini_data.get("answer_completeness"),
                    gemini_data.get("depth_of_knowledge")
                ]
    
            # Final DB write
            update_query = f"""
                UPDATE interview_questions
                SET {', '.join(columns)}
                WHERE id = %s
            """

            values.append(q_id)
            cursor.execute(update_query, values)
            conn.commit()
            print(f"[INFO] ✅ Updated Spoken Question ID {q_id}")
    
        except Exception as e:
            print(f"[ERROR] ❌ Failed to process Question ID {q_id}: {e}")
    

    # === 2. Coding Questions — Only DeepSeek ===
    coding_query = """
        SELECT id, question_text, code_answer
        FROM interview_questions
        WHERE question_type = 'coding'
        AND (improvised_answer IS NULL OR improvised_answer = '')
    """
    if interview_id:
        coding_query += " AND interview_id = %s"
        cursor.execute(coding_query, (interview_id,))
    else:
        cursor.execute(coding_query)


    coding_questions = cursor.fetchall()
    print(f"\n[INFO] Found {len(coding_questions)} coding questions for DeepSeek evaluation.")

    for q_id, question_text, code_answer in coding_questions:
        print(f"\n[DEBUG] Processing Coding Question ID {q_id}")

        if not code_answer or code_answer.strip() == "":
            print("[INFO] No code answer submitted.")
            deepseek_data = {
                "improvised_answer": ask_deepseek(question_text, "")["improvised_answer"],
                "answer_accuracy": 0,
                "answer_completeness": 0,
                "depth_of_knowledge": 0
            }
        else:
            deepseek_data = ask_deepseek(question_text, code_answer)

        if not deepseek_data:
            print("[ERROR] DeepSeek failed after retries.")
            continue

        try:
            cursor.execute("""
                UPDATE interview_questions
                SET improvised_answer = %s, answer_accuracy = %s, answer_completeness = %s, depth_of_knowledge = %s
                WHERE id = %s
            """, (
                deepseek_data.get("improvised_answer"),
                deepseek_data.get("answer_accuracy"),
                deepseek_data.get("answer_completeness"),
                deepseek_data.get("depth_of_knowledge"),
                q_id
            ))

            conn.commit()
            print(f"[INFO] ✅ Updated Coding Question ID {q_id}")
        except Exception as e:
            print(f"[ERROR] Update failed for Coding QID {q_id}: {e}")

    
    print("\n[DEBUG] ✅ All analyses complete.")

        # === 3. Compute Interview-Level Scores ===
    print("\n[INFO] Calculating final interview-level metrics...")

    interview_ids_query = "SELECT DISTINCT interview_id FROM interview_questions"
    if interview_id:
        interview_ids_query += " WHERE interview_id = %s"
        cursor.execute(interview_ids_query, (interview_id,))
    else:
        cursor.execute(interview_ids_query)


    interview_ids = [row[0] for row in cursor.fetchall()]

    for iid in interview_ids:
        cursor.execute("SELECT * FROM interview_questions WHERE interview_id = %s", (iid,))
        questions = cursor.fetchall()
        col_names = [desc[0] for desc in cursor.description]

        # Convert to dicts
        instances = []
        for row in questions:
            row_dict = dict(zip(col_names, row))
            instances.append(row_dict)

        try:
            overall = compute_final_scores(instances)

            update_query = """
                UPDATE interviews
                SET fluency = %s, confidence = %s, lexical = %s, grammar_language = %s, subject_knowledge = %s
                WHERE id = %s
            """
            cursor.execute(update_query, (
                overall.get("fluency"),
                overall.get("confidence"),
                overall.get("lexical"),
                overall.get("grammar_language"),
                overall.get("subject_knowledge"),
                iid
            ))

            conn.commit()
            print(f"[INFO] ✅ Interview ID {iid} updated with overall scores.")

        except Exception as e:
            print(f"[ERROR] Failed to compute/update interview ID {iid}: {e}")
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            interview_id = int(sys.argv[1])
            print(f"[INFO] Running full analysis for Interview ID: {interview_id}")
            analyze_questions(interview_id)
        except ValueError:
            print("[ERROR] Invalid interview ID.")
    else:
        print("[INFO] Running full analysis for ALL interviews...")
        analyze_questions()
