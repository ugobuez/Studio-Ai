FROM python:3.11-slim

WORKDIR /app

# Install system dependencies FIRST
RUN apt-get update && apt-get install -y \
    ffmpeg \
    pkg-config \
    gcc \
    g++ \
    libavcodec-dev \
    libavformat-dev \
    libavdevice-dev \
    libavutil-dev \
    libavfilter-dev \
    libswscale-dev \
    libswresample-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Required for omegaconf / rvc compatibility
RUN pip install --upgrade "pip<24.1"

# Install dependencies
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]