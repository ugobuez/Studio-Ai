import os
import torch
try:
    from rvc_python.infer import RVCInference
    RVC_AVAILABLE = True
except ImportError:
    RVC_AVAILABLE = False
    print("WARNING: rvc_python not available. Voice cloning will be disabled.")
from dotenv import load_dotenv

load_dotenv()

class RVCService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models_dir = os.getenv("MODEL_CACHE_DIR", "./models")
        # HUBERT and RMVPE are required by RVC
        self.hubert_path = os.path.join(self.models_dir, "hubert_base.pt")
        self.rmvpe_path = os.path.join(self.models_dir, "rmvpe.pt")

    def convert_voice(self, model_path, input_path, output_path, pitch_change=0):
        """
        Convert voice using RVC v2.
        model_path: path to the .pth voice model
        input_path: path to the audio to be converted
        output_path: path to save the converted audio
        """
        if not RVC_AVAILABLE:
            raise ImportError("rvc_python is not installed. Voice cloning is disabled.")
        
        print(f"RVC Conversion: {input_path} using {model_path} -> {output_path}")
        
        # Initialize RVC Inference
        rvc = RVCInference(device=self.device)
        
        # Set Hubert and RMVPE paths if needed by the library
        # Some libraries expect them in a specific location or passed to the constructor
        
        rvc.set_model(model_path)
        rvc.infer(
            input_path=input_path,
            output_path=output_path,
            pitch_change=pitch_change,
            f0_method="rmvpe" # Using RMVPE for high quality
        )
        
        return output_path

rvc_service = RVCService()
