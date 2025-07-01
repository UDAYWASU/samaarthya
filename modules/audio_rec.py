import pyaudio
import wave
import numpy as np
import time
import os

FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1024
SILENCE_THRESHOLD_MULTIPLIER = 1.7
SILENCE_DURATION = 2 # seconds

def rms(data):
    audio_data = np.frombuffer(data, dtype=np.int16)
    if len(audio_data) == 0:
        return 0
    mean_square = np.mean(audio_data.astype(np.float64)**2)
    return np.sqrt(max(mean_square, 0))


def calibrate_noise(stream, seconds=2):
    print("Calibrating background noise...")
    volumes = []
    for _ in range(0, int(RATE / CHUNK * seconds)):
        data = stream.read(CHUNK, exception_on_overflow=False)
        volumes.append(rms(data))
    noise_floor = np.mean(volumes)
    print("Calibration complete. Speak now.")
    return noise_floor

def record_audio():
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    noise_floor = calibrate_noise(stream)
    silence_threshold = noise_floor * SILENCE_THRESHOLD_MULTIPLIER

    frames = []
    silence_start = None

    try:
        while True:
            data = stream.read(CHUNK, exception_on_overflow=False)
            volume = rms(data)

            if volume > silence_threshold:
                frames.append(data)
                silence_start = None
            else:
                if silence_start is None:
                    silence_start = time.time()
                elif time.time() - silence_start > SILENCE_DURATION:
                    print("[🔇] Silence detected. Stopping recording.")
                    break
    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()

    filename = "recorded_audio.wav"
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

    print(f"[💾] Audio saved as: {filename}")

if __name__ == "__main__":
    record_audio()
