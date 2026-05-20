from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import os
from services.mastering_service import mastering_service
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class MasterRequest(BaseModel):
    audio_path: str
    target_lufs: float = -14.0

class MasterResponse(BaseModel):
    mastered_path: str
    message: str

@router.post("/master/audio", response_model=MasterResponse)
async def master_audio(request: MasterRequest):
    """
    Endpoint to master an audio file.
    """
    if not os.path.exists(request.audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # Generate output path
    base, ext = os.path.splitext(request.audio_path)
    output_path = f"{base}_mastered{ext}"
    
    try:
        mastered_file = mastering_service.master_audio(
            request.audio_path, 
            output_path, 
            target_lufs=request.target_lufs
        )
        return MasterResponse(
            mastered_path=mastered_file,
            message="Audio mastered successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mastering failed: {str(e)}")
