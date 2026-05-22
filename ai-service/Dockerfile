FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Step 1 — Install torch FIRST at correct version
RUN pip install --upgrade pip && \
    pip install torch==2.1.0 torchaudio==2.1.0 torchvision==0.16.0 \
    --index-url https://download.pytorch.org/whl/cpu

# Step 2 — Install everything else (audiocraft will see torch 2.1.0 already installed)
RUN pip install --no-deps audiocraft==1.3.0
RUN pip install -r requirements.txt --no-deps

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]