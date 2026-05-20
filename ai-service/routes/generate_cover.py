from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.cover_service import cover_service
import os

router = APIRouter()

class CoverRequest(BaseModel):
    genre: str
    mood: str
    title: Optional[str] = "Studio AI"

@router.post("/generate/cover")
async def generate_cover(request: CoverRequest):
    try:
        path = cover_service.generate_cover(
            genre=request.genre,
            mood=request.mood,
            title=request.title
        )
        
        return {
            "status": "success",
            "cover_path": path
        }
    except Exception as e:
        print(f"Error generating cover: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
