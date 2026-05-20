from fastapi import FastAPI
from routes import generate_music, master_audio, generate_voice, clone_voice, generate_lyrics, mixing, generate_cover
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Studio AI Service", description="AI Microservice for Studio AI Music Generation Platform")

# Include routers
app.include_router(generate_music.router, tags=["Music"])
app.include_router(master_audio.router, tags=["Mastering"])
app.include_router(generate_voice.router, tags=["Voice"])
app.include_router(clone_voice.router, tags=["Voice"])
app.include_router(generate_lyrics.router, tags=["Lyrics"])
app.include_router(mixing.router, tags=["Mixing"])
app.include_router(generate_cover.router, tags=["Cover"])

@app.get("/")
async def root():
    return {"message": "Studio AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
