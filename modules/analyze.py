import json
from para import analyze_webm_file     # Your paralinguistic module
from linguistic import analyze_text_from_webm # Your NLP/text module

def run_full_analysis(file_path, domain_keywords=None, verbose=False):
    # Run paralinguistic (audio) analysis
    audio_data = analyze_webm_file(file_path, verbose=verbose)

    # Run transcription + text-based analysis
    text_result = analyze_text_from_webm(file_path, domain_keywords=domain_keywords, verbose=verbose)

    if "error" in text_result:
        return {"error": "No transcribable speech detected."}

    lexical = text_result["lexical_features"]
    grammar = text_result["grammar_and_language"]

    fluency = audio_data.get("fluency", {})
    confidence = audio_data.get("confidence", {})
    clarity = audio_data.get("clarity", {})
    # Build flat DB-ready dictionary
    combined = {
        # 🔍 Fluency
        "speech_rate_wpm": fluency.get("speech_rate_wpm", None),
        "pause_ratio": fluency.get("pause_ratio", None),
        "tempo_variation": fluency.get("tempo_variation", None),

        # 🔊 Confidence
        "avg_pitch": confidence.get("avg_pitch", None),
        "pitch_variation": confidence.get("pitch_variation", None),
        "prosody_slope": confidence.get("prosody_slope", None),
        "jitter": confidence.get("jitter", None),
        "shimmer": confidence.get("shimmer", None),

        # 🧼 Clarity
        "loudness": clarity.get("loudness", None),
        "energy_variability": clarity.get("energy_variability", None),
        "formant_f1": clarity.get("formant_f1", None),
        "formant_f2": clarity.get("formant_f2", None),

        # 🧠 Lexical
        "type_token_ratio": lexical["type_token_ratio"],
        "advanced_vocab_words": json.dumps(lexical["advanced_vocab_words"]),
        "advanced_vocab_usage": lexical["advanced_vocab_usage"],
        "redundant_words": json.dumps(lexical["redundant_words"]),
        "keyword_matches": json.dumps(lexical["keyword_matches"]),
        "keyword_density": lexical["keyword_density"],
        "pronoun_usage_count": lexical["pronoun_usage_count"],
        "pronoun_density": lexical["pronoun_density"],
        "function_word_density": lexical["function_word_density"],
        "lexical_sophistication_index": lexical["lexical_sophistication_index"],

        # ✍️ Grammar
        "grammar_issues": grammar["grammar_issues"],
        "readability_score": grammar["readability_score"],
        "syllables_per_word": grammar["syllables_per_word"],
        "tense_consistency": grammar["tense_consistency"],
    }

    return combined


# === Example Usage ===
if __name__ == "__main__":
    file_path = r"C:\Users\LOQ\Documents\code\NLPIP\web\storage\video\admin_2025-06-20_13-40-19.webm"
    keywords = ["healthcare", "education", "intelligence", "policy"]

    result = run_full_analysis(file_path, domain_keywords=keywords, verbose=True)

    import json
    print(json.dumps(result, indent=2))
