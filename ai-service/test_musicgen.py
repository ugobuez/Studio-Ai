import torch
import os
import sys

# Add the current directory to sys.path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.musicgen_service import musicgen_service

os.environ["MUSICGEN_MODEL"] = "facebook/musicgen-small"
os.environ["OUTPUT_DIR"] = "./outputs"

def test():
    print("Starting MusicGen test...")
    try:
        wav = musicgen_service.generate(
            prompt="lofi hip hop beat with smooth piano and drums",
            duration=5,
            genre="Lofi",
            mood="chill",
            bpm=90
        )
        print("Music generated. Saving...")
        path = musicgen_service.save_audio(wav, "test_output")
        print(f"Audio saved to: {path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test()
