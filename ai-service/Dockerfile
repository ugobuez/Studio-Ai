FROM python:3.11-slim

WORKDIR /app

# System dependencies for PyAV, FFmpeg, audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    pkg-config \
    gcc \
    g++ \
    git \
    build-essential \
    libavformat-dev \
    libavcodec-dev \
    libavdevice-dev \
    libavutil-dev \
    libavfilter-dev \
    libswscale-dev \
    libswresample-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip

# Install CPU-only PyTorch first
RUN pip install torch==2.3.1 torchaudio==2.3.1 \
    --index-url https://download.pytorch.org/whl/cpu

# Install the rest
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn","main:app", \
     "-k","uvicorn.workers.UvicornWorker", \
     "--bind","0.0.0.0:8000"]