import string
from collections import Counter
from nltk.corpus import words, stopwords
from nltk.tokenize import TreebankWordTokenizer
from nltk import pos_tag
import re
import textstat
import language_tool_python
from transcribe import transcribe_webm_local  # your Whisper transcription

# === GRAMMAR AND LANGUAGE ===
def analyze_grammar_and_language(text):
    tool = language_tool_python.LanguageTool('en-US')
    matches = tool.check(text)

    grammar_issues = len(matches)
    readability_score = textstat.flesch_reading_ease(text)
    syllables_per_word = textstat.syllable_count(text) / max(1, len(text.split()))

    past_tense = len(re.findall(r"\b(?:was|were|had|did|spoke|went|said|took|made|saw)\b", text.lower()))
    present_tense = len(re.findall(r"\b(?:is|are|has|do|speak|go|say|take|make|see)\b", text.lower()))
    future_tense = len(re.findall(r"\b(?:will|shall|going to)\b", text.lower()))

    total_tense = past_tense + present_tense + future_tense
    tense_consistency = 1 - (len([t for t in [past_tense, present_tense, future_tense] if t > 0]) - 1) / 2 \
        if total_tense > 0 else 1.0

    return {
        "grammar_issues": grammar_issues,
        "readability_score": round(readability_score, 2),
        "syllables_per_word": round(syllables_per_word, 2),
        "tense_consistency": round(tense_consistency, 2)
    }


# === LEXICAL FEATURES ===
def analyze_lexical_features(text, domain_keywords=None):
    tokenizer = TreebankWordTokenizer()
    tokens = tokenizer.tokenize(text.lower())
    tokens = [t for t in tokens if t not in string.punctuation]

    unique_tokens = set(tokens)
    ttr = len(unique_tokens) / len(tokens) if tokens else 0

    english_vocab = set(words.words())
    advanced_vocab = [w for w in unique_tokens if w.isalpha() and w not in english_vocab]
    adv_vocab_usage = len(advanced_vocab) / len(tokens) if tokens else 0

    word_freq = Counter(tokens)
    redundant_words = [word for word, count in word_freq.items() if count > 2]

    matched_keywords = [k for k in domain_keywords if k.lower() in tokens] if domain_keywords else []
    keyword_density = len(matched_keywords) / len(tokens) if tokens else 0

    pronouns = {'i', 'we', 'you', 'he', 'she', 'they', 'me', 'him', 'her', 'us', 'them', 'my',
                'your', 'his', 'their', 'our', 'mine'}
    pronoun_count = sum(1 for t in tokens if t in pronouns)
    pronoun_density = pronoun_count / len(tokens) if tokens else 0

    function_words = set(stopwords.words('english'))
    function_word_count = sum(1 for t in tokens if t in function_words)
    function_word_density = function_word_count / len(tokens) if tokens else 0

    total_freq = sum(word_freq[w] for w in unique_tokens)
    avg_freq = total_freq / len(unique_tokens) if unique_tokens else 0
    lexical_sophistication_index = 1 / avg_freq if avg_freq else 0

    return {
        'type_token_ratio': round(ttr, 3),
        'advanced_vocab_words': advanced_vocab,
        'advanced_vocab_usage': round(adv_vocab_usage, 3),
        'redundant_words': redundant_words,
        'keyword_matches': matched_keywords,
        'keyword_density': round(keyword_density, 3),
        'pronoun_usage_count': pronoun_count,
        'pronoun_density': round(pronoun_density, 3),
        'function_word_density': round(function_word_density, 3),
        'lexical_sophistication_index': round(lexical_sophistication_index, 3)
    }


# === MASTER FUNCTION TO RUN FULL ANALYSIS ===
def analyze_text_from_webm(file_path, domain_keywords=None, verbose=False):
    """
    Transcribe audio from webm and analyze grammar and lexical features.

    Args:
        file_path (str): Path to .webm file
        domain_keywords (list): Optional domain-specific keywords
        verbose (bool): Print debug info

    Returns:
        dict: Full analysis results
    """
    text = transcribe_webm_local(file_path)

    if verbose:
        print(f"[INFO] Transcribed Text:\n{text.strip()[:300]}...\n")

    if not text.strip():
        return {"error": "No transcribable speech detected."}

    grammar_data = analyze_grammar_and_language(text)
    lexical_data = analyze_lexical_features(text, domain_keywords=domain_keywords)

    result = {
        "transcribed_text": text,
        "grammar_and_language": grammar_data,
        "lexical_features": lexical_data
    }

    return result


# === Example Usage ===
if __name__ == "__main__":
    file_path = r"C:\Users\LOQ\Documents\code\NLPIP\web\storage\video\user_2025-06-18_08-48-35.webm"
    keywords = ["healthcare", "education", "intelligence", "policy"]

    results = analyze_text_from_webm(file_path, domain_keywords=keywords, verbose=True)

    from pprint import pprint
    pprint(results)
