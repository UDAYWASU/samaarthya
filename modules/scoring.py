def normalize_range(x, min_val, max_val, invert=False):
    if x is None:
        return 0.0
    score = (x - min_val) / (max_val - min_val)
    score = 1 - score if invert else score
    return max(0.0, min(1.0, score))

fluency_weights = {
    "speech_rate_wpm": (120, 160, 0.4),      # ideal range, weight
    "pause_ratio": (0.1, 0.3, 0.3),          # invert=True
    "tempo_variation": (0.0, 0.5, 0.3),      # invert=True
}

confidence_weights = {
    "avg_pitch": (85, 255, 0.2),             # gender-neutral range
    "pitch_variation": (20, 60, 0.25),
    "prosody_slope": (-1.0, 1.0, 0.15),
    "jitter": (0.0, 0.05, 0.2),              # invert=True
    "shimmer": (0.0, 0.05, 0.2),             # invert=True
}

lexical_weights = {
    "type_token_ratio": (0.3, 0.8, 0.3),
    "advanced_vocab_usage": (0.05, 0.3, 0.3),
    "keyword_density": (0.01, 0.05, 0.2),
    "lexical_sophistication_index": (0.4, 0.8, 0.2),
}

grammar_weights = {
    "grammar_issues": (0, 5, 0.4),            # invert=True
    "readability_score": (50, 80, 0.2),
    "syllables_per_word": (1.3, 1.8, 0.2),
    "tense_consistency": (0.8, 1.0, 0.2),
}

subject_weights = {
    "answer_accuracy": (0, 100, 0.3),
    "answer_completeness": (0, 100, 0.3),
    "depth_of_knowledge": (0, 100, 0.4),
}

def score_category(instances, metrics, invert_metrics=None):
    invert_metrics = invert_metrics or set()
    total_score = 0
    for metric, (min_val, max_val, weight) in metrics.items():
        values = [instance.get(metric) for instance in instances]
        valid_values = [v for v in values if v is not None]
        if not valid_values:
            continue
        avg = sum(valid_values) / len(valid_values)
        normalized = normalize_range(avg, min_val, max_val, invert=(metric in invert_metrics))
        total_score += normalized * weight
    return round(total_score * 100, 2)

def compute_final_scores(instances):
    invert_fluency = {"pause_ratio", "tempo_variation"}
    invert_confidence = {"jitter", "shimmer"}
    invert_grammar = {"grammar_issues"}

    return {
        "fluency": score_category(instances, fluency_weights, invert_fluency),
        "confidence": score_category(instances, confidence_weights, invert_confidence),
        "lexical": score_category(instances, lexical_weights),
        "grammar_language": score_category(instances, grammar_weights, invert_grammar),
        "subject_knowledge": score_category(instances, subject_weights),
    }
