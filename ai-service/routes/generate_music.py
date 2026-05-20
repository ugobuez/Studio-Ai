from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.musicgen_service import musicgen_service
import uuid
import os

router = APIRouter()

class MusicGenerateRequest(BaseModel):
    prompt: str
    genre: Optional[str] = None
    mood: Optional[str] = None
    bpm: Optional[int] = None
    key: Optional[str] = None
    duration: Optional[int] = 30
    lyrics: Optional[str] = None
    instrumental: Optional[bool] = True

@router.post("/generate/music")
async def generate_music(request: MusicGenerateRequest):
    try:
        # Generate music tensor
        wav = musicgen_service.generate(
            prompt=request.prompt,
            duration=request.duration,
            genre=request.genre,
            mood=request.mood,
            bpm=request.bpm,
            key=request.key
        )
        
        # Save to file
        filename = f"gen_{uuid.uuid4()}"
        output_path = musicgen_service.save_audio(wav, filename)
        
        return {
            "status": "success",
            "audio_path": output_path,
            "metadata": {
                "prompt": request.prompt,
                "genre": request.genre,
                "mood": request.mood,
                "bpm": request.bpm,
                "key": request.key,
                "duration": request.duration
            }
        }
    except Exception as e:
        print(f"Error generating music: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
