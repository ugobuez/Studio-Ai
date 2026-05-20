# Studio AI Service

This is the AI microservice for Studio AI, built with FastAPI and Python.

## Features
- **Music Generation**: Text-to-music generation using `facebook/musicgen-large` via Meta's `audiocraft`.
- **Lyric Generation**: AI songwriting powered by Fireworks AI (Llama 3.1 70B).
- **Vocal Synthesis**: Professional-grade TTS using Coqui `XTTS-v2`.
- **Voice Conversion**: High-quality voice cloning with `RVC v2`.
- **Audio Processing**: Custom mixing and professional mastering pipeline (-14 LUFS standard).
- **Cover Art Generation**: Automated album cover generation using Stable Diffusion (`segmind/tiny-sd`).

## API Endpoints

### Music Generation
- `POST /generate/music`: Generate a music track based on prompt, genre, and mood.

### Lyric Generation
- `POST /generate/lyrics`: Generate lyrics and song structure.

### Vocal & Voice
- `POST /generate/voice`: Synthesize vocals from lyrics using a reference speaker.
- `POST /clone/voice`: Apply a voice profile to an existing audio track.

### Audio Processing
- `POST /mix/audio`: Combine vocal and instrumental tracks.
- `POST /master/audio`: Apply professional mastering and LUFS normalization.

### Cover Art
- `POST /generate/cover`: Generate a 3000x3000px album cover.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=8000
   MODEL_CACHE_DIR=./models
   OUTPUT_DIR=./outputs
   FIREWORKS_API_KEY=your_key_here
   ```

4. Start the service:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
