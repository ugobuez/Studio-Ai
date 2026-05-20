import sys
import os

# Add current directory to path to find services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.xtts_service import xtts_service
import torch

def test_xtts():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    text = "Welcome to Studio AI. We generate the best Afrobeat music for you."
    speaker_wav = os.path.join(base_dir, "coqui-tts/tests/inputs/example_1.wav")
    output_dir = os.path.join(base_dir, "outputs")
    output_path = os.path.join(output_dir, "test_vocal.wav")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print("Testing XTTS generation...")
    try:
        path = xtts_service.generate_voice(text, speaker_wav, output_path)
        print(f"Success! Generated vocal at: {path}")
    except Exception as e:
        print(f"Failed to generate vocal: {str(e)}")

if __name__ == "__main__":
    test_xtts()
