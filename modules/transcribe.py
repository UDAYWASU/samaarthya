import whisper
import subprocess
import os

def transcribe_webm_local(file_path: str) -> str:
    """
    Extract audio from .webm video and transcribe using local Whisper small model.

    Args:
        file_path (str): Path to the input .webm file.

    Returns:
        str: Transcribed text.
    """
    # Step 1: Extract audio as a temporary .wav file using ffmpeg
    audio_path = "temp_audio.wav"
    try:
        # Extract audio using ffmpeg
        subprocess.run([
            "ffmpeg",
            "-y",  # overwrite output file if exists
            "-i", file_path,
            "-ar", "16000",  # sample rate Whisper prefers
            "-ac", "1",      # mono channel
            audio_path
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        print("Error extracting audio:", e)
        return ""

    # Step 2: Load Whisper small model
    model = whisper.load_model("small")

    # Step 3: Transcribe audio
    result = model.transcribe(audio_path)

    # Clean up temp audio file
    os.remove(audio_path)

    return result["text"]

# Example usage:
if __name__ == "__main__":
    text = transcribe_webm_local(r"C:\Users\LOQ\Documents\code\NLPIP\web\storage\video\Shripad shyam Ingole_2025-06-21_13-46-37.webm")
    print(text)
