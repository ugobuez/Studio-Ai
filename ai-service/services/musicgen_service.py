import os
import torch
import torchaudio
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
from dotenv import load_dotenv

load_dotenv()

class MusicGenService:
    def __init__(self):
        self.model_name = os.getenv("MUSICGEN_MODEL", "facebook/musicgen-large")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.target_sample_rate = int(os.getenv("SAMPLE_RATE", 44100))
        self.model = None

    def load_model(self):
        if self.model is None:
            print(f"Loading MusicGen model: {self.model_name} on {self.device}...")
            self.model = MusicGen.get_pretrained(self.model_name)
            print("Model loaded successfully.")

    def generate(self, prompt, duration=30, genre=None, mood=None, bpm=None, key=None):
        self.load_model()
        
        # Build rich prompt as per guidelines
        rich_prompt = prompt
        if genre:
            rich_prompt += f", {genre}"
        if mood:
            rich_prompt += f", {mood} mood"
        if bpm:
            rich_prompt += f", {bpm} BPM"
        if key:
            rich_prompt += f", key of {key}"
        
        rich_prompt += ", professional studio quality, high fidelity"
        
        print(f"Generating music with prompt: {rich_prompt}")
        
        self.model.set_generation_params(duration=duration)
        wav = self.model.generate([rich_prompt], progress=True)
        
        # wav is [1, C, T]
        output_wav = wav[0]
        
        # Resample if needed
        if self.model.sample_rate != self.target_sample_rate:
            print(f"Resampling from {self.model.sample_rate} to {self.target_sample_rate}...")
            resampler = torchaudio.transforms.Resample(self.model.sample_rate, self.target_sample_rate).to(output_wav.device)
            output_wav = resampler(output_wav)
            
        return output_wav

    def save_audio(self, wav, filename):
        output_dir = os.getenv("OUTPUT_DIR", "./outputs")
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        output_path = os.path.join(output_dir, filename)
        # audio_write adds .wav extension
        # wav is [C, T]
        path = audio_write(output_path, wav.cpu(), self.target_sample_rate, strategy="loudness", loudness_compressor=True)
        return path

musicgen_service = MusicGenService()
