import sqlite3
import json
from transcribe import transcribe_webm_local
from openai import OpenAI
import os

BASE_VIDEO_DIR = r"C:\Users\LOQ\Documents\code\NLPIP\web\storage\video"



# API setup
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",  # <-- Replace this
)

# Build evaluation prompt
def build_evaluation_prompt(question, answer):
    return [
        {
            "role": "system",
            "content": "You are an expert evaluator of interview responses. Given a question and an answer (spoken or code), assess the quality of the response. Respond in JSON with the following:\n\n"
                       "{\n"
                       "  \"improvised_answer\": \"Rephrased or improved version of the answer\",\n"
                       "  \"answer_accuracy\": float (0-1),\n"
                       "  \"answer_completeness\": float (0-1),\n"
                       "  \"depth_of_knowledge\": float (0-1)\n"
                       "}"
        },
        {
            "role": "user",
            "content": f"Question: {question}\n\nAnswer: {answer}\n\nEvaluate the answer."
        }
    ]

# Run OpenRouter API evaluation
def evaluate_answer(question, answer):
    prompt = build_evaluation_prompt(question, answer)
    response = client.chat.completions.create(
        model="deepseek/deepseek-r1-0528:free",
        messages=prompt
    )
    text = response.choices[0].message.content

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        print("[WARNING] JSON parsing failed. Raw output:", text)
        return {
            "improvised_answer": text,
            "answer_accuracy": None,
            "answer_completeness": None,
            "depth_of_knowledge": None
        }
    return data

# Process entries from DB and return evaluation
def process_interview_answers(db_path, interview_id):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, question_text, question_type, video_path, code_answer
        FROM interview_questions
        WHERE interview_id = ?
    """, (interview_id,))

    rows = cursor.fetchall()
    results = []

    for row in rows:
        qid, qtext, qtype, video_path, code_ans = row
        print(f"\n[INFO] Processing Question {qid} ({qtype})")

        if qtype == 'spoken':
            if not video_path:
                print(f"[WARNING] No video path for spoken question {qid}")
                continue
            # Inside your loop:
            full_path = os.path.join(BASE_VIDEO_DIR, video_path)
            transcript = transcribe_webm_local(full_path)
            answer = transcript
        elif qtype == 'coding':
            answer = code_ans or ""
        else:
            print(f"[WARNING] Unknown question type {qtype}")
            continue

        eval_result = evaluate_answer(qtext, answer)
        print(f"[RESULT for Q{qid}]: {json.dumps(eval_result, indent=2)}")
        results.append({
            "question_id": qid,
            **eval_result
        })

    conn.close()
    return results


# === Example Execution ===
if __name__ == "__main__":
    db_path = r"C:\Users\LOQ\Documents\code\NLPIP\web\backend\mockinterview.db"  # Replace with your actual DB path
    interview_id = 6                  # Replace with desired interview ID

    output = process_interview_answers(db_path, interview_id)

    print("\n✅ FINAL OUTPUT JSON:")
    print(json.dumps(output, indent=2))
