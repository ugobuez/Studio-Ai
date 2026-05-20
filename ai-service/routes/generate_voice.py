from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.xtts_service import xtts_service
import uuid
import os

router = APIRouter()

class VoiceGenerateRequest(BaseModel):
    text: str
    speaker_wav: str  # Path to reference voice sample
    language: Optional[str] = "en"

@router.post("/generate/voice")
async def generate_voice(request: VoiceGenerateRequest):
    try:
        output_dir = os.getenv("OUTPUT_DIR", "./outputs")
        os.makedirs(output_dir, exist_ok=True)
        
        filename = f"voice_{uuid.uuid4()}.wav"
        output_path = os.path.join(output_dir, filename)
        
        path = xtts_service.generate_voice(
            text=request.text,
            speaker_wav=request.speaker_wav,
            output_path=output_path,
            language=request.language
        )
        
        return {
            "status": "success",
            "audio_path": path
        }
    except Exception as e:
        print(f"Error generating voice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
