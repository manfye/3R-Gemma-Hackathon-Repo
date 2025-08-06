from fastapi import FastAPI
# import torch._dynamo.config

from app.models import load_models
from app.routers import generation

# torch._dynamo.config.recompile_limit = 512

app = FastAPI(
    title="Gemma3N Inference API",
    description="An API to run inference on Gemma3N models with Unsloth.",
    version="0.1.0",
)

@app.on_event("startup")
async def startup_event():
    print("Starting up and loading models...")
    load_models()


@app.get("/healthcheck", tags=["Health Check"])
async def read_root():
    return {"message": "FAstAPI is running and models are loaded."}


app.include_router(generation.router)

