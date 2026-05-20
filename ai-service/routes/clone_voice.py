from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rvc_service import rvc_service
import uuid
import os

router = APIRouter()

class VoiceCloneRequest(BaseModel):
    voice_sample_path: str  # The reference voice (.pth or index or wav)
    target_audio_path: str  # The synthesized vocal to be converted

@router.post("/clone/voice")
async def clone_voice(request: VoiceCloneRequest):
    try:
        output_dir = os.getenv("OUTPUT_DIR", "./outputs")
        os.makedirs(output_dir, exist_ok=True)
        
        filename = f"cloned_{uuid.uuid4()}.wav"
        output_path = os.path.join(output_dir, filename)
        
        # In RVC, we usually have a .pth model for the specific voice.
        # If voice_sample_path is a wav, we might need to train (not for MVP)
        # or find the best matching pre-trained model.
        # For MVP, we assume we have pre-trained .pth models or we use a zero-shot RVC.
        
        path = rvc_service.convert_voice(
            model_path=request.voice_sample_path,
            input_path=request.target_audio_path,
            output_path=output_path
        )
        
        return {
            "status": "success",
            "output_path": path
        }
    except Exception as e:
        print(f"Error cloning voice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
