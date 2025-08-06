# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3R Gemma Hackathon project that implements an AI-powered garbage classification system using computer vision and hand tracking. The system consists of multiple components:

1. **Garbage Classification Benchmark** (`1. Garbage_classification_benchmark/`) - Ground truth dataset and benchmarking tools
2. **LLM Benchmark Notebook** (`2. LLM_benchmark_notebook/`) - Performance evaluation of different models
3. **Finetune Gemma Notebook** (`3. Finetune_gemma_notebook/`) - Fine-tuning scripts for Gemma models
4. **Inference Script Notebook** (`4. Inference_script_notebook/`) - Inference testing notebooks
5. **Backend Inference Server** (`5. Backend_Inference_server/`) - FastAPI backend with Gemma models
6. **Frontend Application** (`6. Front_end_repo/`) - Next.js web application with hand tracking

## Architecture

### Backend (FastAPI)
- Uses Unsloth to run fine-tuned Gemma vision models (e2b and e4b variants)
- Models: `qizunlee/gemma3n_E2B_it_ft_3RGarbageClassification` and `qizunlee/gemma3n_E4B_it_ft_3RGarbageClassification`
- Provides `/gemma3n/inference` endpoint for image classification
- Requires specific installation order: unsloth → timm → transformers → other requirements

### Frontend (Next.js)
- Hand tracking using MediaPipe Hands for auto-capture
- Real-time camera feed with 3-2-1 countdown
- Dual classification options: OpenAI GPT-4 Vision API or local Gemma backend
- Classifies into 6 categories: Cardboard (A), Glass (B), Metal (C), Paper (D), Plastic (E), Trash (F)

## Development Commands

### Backend Server
```bash
cd "5. Backend_Inference_server"
# Install dependencies (specific order required)
pip install unsloth
pip install --no-deps --upgrade timm
pip install transformers
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
# Server runs on http://127.0.0.1:8000
```

### Frontend Application
```bash
cd "6. Front_end_repo"
# Install dependencies
npm install

# Development
npm run dev      # Start dev server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Key Files and Components

### Backend Structure
- `app/main.py` - FastAPI application entry point, model loading on startup
- `app/models.py` - Model loading logic using Unsloth FastVisionModel
- `app/routers/generation.py` - Inference endpoint implementation

### Frontend Structure
- `src/app/page.js` - Main application with hand tracking and camera
- `src/app/components/MediaPipeLoader.js` - MediaPipe initialization
- `src/app/hooks/useMediaPipe.js` - Hand detection hook
- `src/app/api/classify/route.js` - OpenAI API integration
- `src/app/api/classify/local/route.js` - Local Gemma backend integration

## Environment Setup

### Backend Requirements
- Python 3.11
- PyTorch 2.7.1
- CUDA 12.6
- Virtual environment recommended

### Frontend Requirements
- Node.js environment
- OpenAI API key for GPT-4 Vision (in `.env.local`)
- HTTPS required for camera access

## Model Information

The project uses fine-tuned Gemma models specifically trained for garbage classification:
- **E2B variant**: Optimized version with specific training parameters
- **E4B variant**: Alternative training configuration
- Both models classify images into the 6-category system (A-F)
- Models are loaded with 4-bit quantization for efficiency