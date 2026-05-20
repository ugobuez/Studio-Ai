import os
import torch
from TTS.api import TTS
from dotenv import load_dotenv

load_dotenv()

# Agree to Coqui TOS
os.environ["COQUI_TOS_AGREED"] = "1"

class XTTSService:
    def __init__(self):
        self.model_name = os.getenv("XTTS_MODEL", "tts_models/multilingual/multi-dataset/xtts_v2")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None

    def _load_model(self):
        if self.model is None:
            print(f"Loading XTTS model: {self.model_name} on {self.device}")
            # Ensure TOS is agreed before loading
            self.model = TTS(self.model_name).to(self.device)
        return self.model

    def generate_voice(self, text, speaker_wav, output_path, language="en"):
        """
        Generate voice from text using a speaker reference wav.
        """
        model = self._load_model()
        model.tts_to_file(
            text=text,
            speaker_wav=speaker_wav,
            language=language,
            file_path=output_path
        )
        return output_path

xtts_service = XTTSService()
