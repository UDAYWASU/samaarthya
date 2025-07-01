import numpy as np
import librosa
from pyAudioAnalysis import audioBasicIO
from pyAudioAnalysis import ShortTermFeatures
import parselmouth
from parselmouth.praat import call
import subprocess
import os
from transcribe import transcribe_webm_local



def estimate_speech_rate_transcribed(y, sr, file_path, verbose=False):
    
    text = transcribe_webm_local(file_path)
    word_count = len(text.split())

    intervals = librosa.effects.split(y, top_db=20)
    total_voiced_duration = sum((end - start)/sr for start, end in intervals)

    speech_rate_wpm = word_count * 60 / total_voiced_duration if total_voiced_duration > 0 else 0

    if verbose:
        print(f"[DEBUG] Whisper Word Count: {word_count}")
        print(f"[DEBUG] Total Voiced Duration: {total_voiced_duration:.2f} sec")
        print(f"[DEBUG] Actual WPM: {speech_rate_wpm:.2f}")
        print(f"[DEBUG] Transcribed Text:\n{text}")

    return speech_rate_wpm, [((end - start)/sr) for start, end in intervals]



# === 1. Speech Rate ===
def estimate_speech_rate(y, sr, verbose=False):
    intervals = librosa.effects.split(y, top_db=20)
    durations = [(end - start)/sr for start, end in intervals]
    total_voiced_duration = sum(durations)
    est_words = total_voiced_duration * 2.5  # Rough average
    speech_rate_wpm = est_words * 60 / total_voiced_duration if total_voiced_duration > 0 else 0
    if verbose:
        print(f"[DEBUG] Voiced segments count: {len(intervals)}")
        print(f"[DEBUG] Total voiced time: {round(total_voiced_duration, 2)} sec")
        print(f"[DEBUG] Estimated words: {round(est_words, 2)}")
    return speech_rate_wpm, durations

# === 2. Pause Ratio ===
def estimate_pause_ratio(y, sr, verbose=False):
    total_length = len(y) / sr
    voiced = librosa.effects.split(y, top_db=20)
    voiced_dur = sum([(end - start)/sr for start, end in voiced])
    pause_ratio = 1 - (voiced_dur / total_length)
    if verbose:
        print(f"[DEBUG] Pause duration: {round(total_length - voiced_dur, 2)} sec")
        print(f"[DEBUG] Pause ratio: {round(pause_ratio, 2)}")
    return pause_ratio

# === 3. Pitch (avg, std) using Parselmouth ===
def extract_pitch_parselmouth(file_path, verbose=False):
    snd = parselmouth.Sound(file_path)
    pitch = snd.to_pitch()
    pitch_values = [p for p in pitch.selected_array['frequency'] if 50 < p < 500]
    if not pitch_values:
        return 0, 0
    if verbose:
        print(f"[DEBUG] Parselmouth pitch count: {len(pitch_values)}")
    return np.mean(pitch_values), np.std(pitch_values)

# === 4. Prosody (Pitch slope) ===
def extract_prosody_slope(file_path, verbose=False):
    snd = parselmouth.Sound(file_path)
    pitch = snd.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    time_stamps = np.linspace(0, snd.duration, len(pitch_values))
    voiced = (pitch_values > 50) & (pitch_values < 500)
    if np.sum(voiced) < 5:
        return 0
    slope = np.polyfit(time_stamps[voiced], pitch_values[voiced], 1)[0]
    if verbose:
        print(f"[DEBUG] Prosody slope: {round(slope, 3)}")
    return slope

# === 5. Jitter & Shimmer (ZCR and Energy proxies) ===
def extract_jitter_shimmer(file_path, verbose=False):
    [Fs, x] = audioBasicIO.read_audio_file(file_path)
    x = audioBasicIO.stereo_to_mono(x)
    F, _ = ShortTermFeatures.feature_extraction(x, Fs, 0.050*Fs, 0.025*Fs)
    jitter = np.std(F[0, :])
    shimmer = np.std(F[1, :])
    if verbose:
        print(f"[DEBUG] ZCR (Jitter proxy) values: {np.round(F[0, :10], 5)}")
        print(f"[DEBUG] Energy (Shimmer proxy) values: {np.round(F[1, :10], 5)}")
    return jitter, shimmer

# === 6. Loudness (RMS mean) ===
def estimate_loudness(y, verbose=False):
    rms = librosa.feature.rms(y=y)
    if verbose:
        print(f"[DEBUG] RMS values (first 10 frames): {np.round(rms[0][:10], 5)}")
    return float(np.mean(rms))

# === 7. Energy Variability (RMS std dev) ===
def estimate_energy_variability(y, verbose=False):
    rms = librosa.feature.rms(y=y)
    return float(np.std(rms))

# === 8. Formant Analysis (F1, F2 means) ===
def extract_formants(file_path, verbose=False):
    snd = parselmouth.Sound(file_path)
    formant = snd.to_formant_burg()
    f1_vals = []
    f2_vals = []
    for t in np.arange(0, snd.duration, 0.01):  # every 10ms
        try:
            f1 = formant.get_value_at_time(1, t)
            f2 = formant.get_value_at_time(2, t)
            if f1 and f2 and 200 < f1 < 1000 and 500 < f2 < 3000:
                f1_vals.append(f1)
                f2_vals.append(f2)
        except:
            continue
    if f1_vals and f2_vals:
        if verbose:
            print(f"[DEBUG] F1 mean: {np.mean(f1_vals):.2f}, F2 mean: {np.mean(f2_vals):.2f}")
        return np.mean(f1_vals), np.mean(f2_vals)
    else:
        if verbose:
            print("[WARNING] No valid F1/F2 formant values found.")
        return float('nan'), float('nan')


# === 9. Tempo Consistency ===
def estimate_tempo_consistency(voiced_durations):
    if len(voiced_durations) < 2:
        return 0
    return round(np.std(voiced_durations), 3)


def getparadata(file_path, verbose=False):
    # === Load Audio ===
    y, sr = librosa.load(file_path, sr=None)
    if verbose:
        print(f"[INFO] Sample rate: {sr}, Audio duration: {round(len(y)/sr, 2)} sec")
    # === Run All Feature Extraction ===
    speech_rate, durations = estimate_speech_rate_transcribed(y, sr, file_path, verbose)

    pause_ratio = estimate_pause_ratio(y, sr, verbose)
    pitch_mean, pitch_std = extract_pitch_parselmouth(file_path, verbose)
    pitch_slope = extract_prosody_slope(file_path, verbose)
    jitter, shimmer = extract_jitter_shimmer(file_path, verbose)
    loudness = estimate_loudness(y, verbose)
    energy_var = estimate_energy_variability(y, verbose)
    f1_mean, f2_mean = extract_formants(file_path, verbose)
    tempo_variation = estimate_tempo_consistency(durations)

    # === Summary ===
    results = {
        "fluency": {
            "speech_rate_wpm": round(speech_rate, 2),
            "pause_ratio": round(pause_ratio, 2),
            "tempo_variation": tempo_variation,
        },
        "confidence": {
            "avg_pitch": round(pitch_mean, 2),
            "pitch_variation": round(pitch_std, 2),
            "prosody_slope": round(pitch_slope, 2),
            "jitter": round(jitter, 4),
            "shimmer": round(shimmer, 4),
        },
        "clarity": {
            "loudness": round(loudness, 5),
            "energy_variability": round(energy_var, 5),
            "formant_f1": f1_mean,
            "formant_f2": f2_mean,
        }
    }
    return results


def analyze_webm_file(webm_file_path, verbose=False):
    """
    Extract audio from webm file and run paralinguistic analysis.

    Args:
        webm_file_path (str): Path to input .webm file.

    Returns:
        dict: Dictionary with paralinguistic features.
    """
    temp_wav_path = "temp_extracted_audio.wav"
    try:
        # Extract audio to WAV using ffmpeg
        subprocess.run([
            "ffmpeg",
            "-y",
            "-i", webm_file_path,
            "-ar", "16000",
            "-ac", "1",
            temp_wav_path
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if verbose:
            print(f"[INFO] Extracted audio saved to {temp_wav_path}")

        # Run your existing paralinguistic data extraction on WAV file
        results = getparadata(temp_wav_path, verbose)

    except subprocess.CalledProcessError as e:
        print(f"[ERROR] ffmpeg failed: {e}")
        results = {}

    finally:
        # Clean up temporary WAV file
        if os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)

    return results


if __name__ == "__main__":
    # Example usage: replace with your webm file path
    webm_file = r"C:\Users\LOQ\Documents\code\NLPIP\web\storage\video\admin_2025-06-20_13-40-19.webm"
    analysis_results = analyze_webm_file(webm_file, verbose=True)

    print("\n[FINAL ANALYSIS RESULTS]")
    print(analysis_results)
