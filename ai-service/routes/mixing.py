from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.mixing_service import mixing_service
import uuid
import os

router = APIRouter()

class MixingRequest(BaseModel):
    vocal_path: str
    instrumental_path: str
    vocal_vol: Optional[float] = -6.0
    instrumental_vol: Optional[float] = 0.0

@router.post("/mix/audio")
async def mix_audio(request: MixingRequest):
    try:
        output_dir = os.getenv("OUTPUT_DIR", "./outputs")
        os.makedirs(output_dir, exist_ok=True)
        
        filename = f"mixed_{uuid.uuid4()}.wav"
        output_path = os.path.join(output_dir, filename)
        
        path = mixing_service.mix_vocals_instrumental(
            vocal_path=request.vocal_path,
            instrumental_path=request.instrumental_path,
            output_path=output_path,
            vocal_vol=request.vocal_vol,
            instrumental_vol=request.instrumental_vol
        )
        
        return {
            "status": "success",
            "output_path": path
        }
    except Exception as e:
        print(f"Error mixing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
