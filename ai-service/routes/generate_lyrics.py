from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.lyrics_service import lyrics_service

router = APIRouter()

class LyricsRequest(BaseModel):
    prompt: str
    genre: str
    mood: str

@router.post("/generate/lyrics")
async def generate_lyrics(request: LyricsRequest):
    try:
        lyrics = lyrics_service.generate_lyrics(
            prompt=request.prompt,
            genre=request.genre,
            mood=request.mood
        )
        
        if lyrics.startswith("Error generating lyrics") or lyrics.startswith("Lyrics generation is currently unavailable"):
             raise HTTPException(status_code=500, detail=lyrics)
             
        return {
            "status": "success",
            "lyrics": lyrics
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error in /generate/lyrics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
