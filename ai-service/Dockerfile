# ── Stage 1: Base image ──────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# ── Stage 2: System dependencies ────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    libsndfile1-dev \
    libffi-dev \
    libffi8 \
    libssl-dev \
    libblas-dev \
    liblapack-dev \
    libcffi-dev \
    git \
    curl \
    wget \
    build-essential \
    gcc \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ── Stage 3: Upgrade pip + core tools + cffi FIRST ──────────────
RUN pip install --upgrade pip setuptools wheel
RUN pip install cffi==1.16.0

# ── Stage 4: Pydantic (fastapi depends on it) ───────────────────
RUN pip install \
    annotated-types==0.6.0 \
    pydantic-core==2.18.2 \
    pydantic==2.7.1 \
    pydantic-settings==2.2.1

# ── Stage 5: PyTorch CPU (MUST be 2.1.0 for audiocraft) ─────────
RUN pip install \
    torch==2.1.0 \
    torchaudio==2.1.0 \
    torchvision==0.16.0 \
    --index-url https://download.pytorch.org/whl/cpu

# ── Stage 6: Soundfile AFTER cffi is installed ──────────────────
RUN pip install soundfile==0.12.1

# ── Stage 7: Audiocraft AFTER torch + soundfile ─────────────────
RUN pip install audiocraft==1.3.0

# ── Stage 8: FastAPI + Uvicorn stack ────────────────────────────
RUN pip install \
    click==8.1.7 \
    h11==0.14.0 \
    anyio==4.3.0 \
    sniffio==1.3.1 \
    starlette==0.37.2 \
    uvicorn[standard]==0.30.1 \
    fastapi==0.111.0

# ── Stage 9: Audio processing ───────────────────────────────────
RUN pip install \
    numpy==1.26.4 \
    scipy==1.11.4 \
    librosa==0.10.1 \
    pedalboard==0.9.9 \
    pydub==0.25.1 \
    pyloudnorm==0.1.1

# ── Stage 10: ML + HuggingFace ──────────────────────────────────
RUN pip install \
    scikit-learn==1.3.2 \
    einops==0.7.0 \
    transformers==4.40.0 \
    accelerate==0.29.3 \
    huggingface_hub==0.22.2 \
    diffusers==0.27.2

# ── Stage 11: Voice synthesis ───────────────────────────────────
RUN pip install TTS==0.22.0

# ── Stage 12: Remaining utils ───────────────────────────────────
RUN pip install \
    Pillow==10.3.0 \
    mutagen==1.47.0 \
    python-multipart==0.0.9 \
    requests==2.31.0 \
    python-dotenv==1.0.1 \
    typing-extensions==4.11.0 \
    httpx==0.27.0 \
    ollama==0.2.1

# ── Stage 13: Copy app code LAST ────────────────────────────────
COPY . .

RUN mkdir -p outputs models uploads

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]