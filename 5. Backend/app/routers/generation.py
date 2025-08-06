from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from unsloth import FastVisionModel
from transformers import TextIteratorStreamer
from PIL import Image
import io
import torch
from threading import Thread


from app.models import models



router = APIRouter(
    prefix="/gemma3n", 
    tags=["Gemma3N Inference"]
)

PROMPT_FOR_VISION = (
    "You are a garbage classification assistant. Based on the image, identify and classify all distinct parts of the object. "
    "For each part, determine the type of garbage from the following options: A: Cardboard, B: Glass, C: Metal, D: Paper, E: Plastic, F: Trash. "
    "Your response must be in a JSON format. The JSON should contain a single key, 'material', which holds an array of objects. "
    "Each object in the array must have two keys: 'part_name' (a brief description of the item) and 'answer' (the classification from the provided options, in the format 'A: Cardboard'). "
    "If the image contains multiple distinct parts made of different materials, list each part as a separate object in the 'material' array. "
    "For example, if the image shows a paper coffee cup with a plastic lid, you should output two separate objects in the array. "
    "The cup should be classified as 'D: Paper' and the lid as 'E: Plastic'. "
    "If a part is not classified into a specific category, consider it as 'F: Trash'. "
    "**Do not repeat an object part if it is identical to a previously listed part. For example, if there are multiple apples, only list 'Apples' once.**"
)


@router.post("/inference")
async def inference(
    image: UploadFile = File(...),
    model_choice: str = Form(...)
):
    """
    Generates a JSON response based on an image using the selected Unsloth Gemma model.
    The response is streamed back to the client.
    """
    if model_choice not in models:
        raise HTTPException(status_code=400, detail="Invalid model choice. Available options: 'e2b', 'e4b'")

    # Get the selected model and tokenizer
    model_info = models[model_choice]
    model = model_info["model"]
    tokenizer = model_info["tokenizer"]

    # Enable model for inference
    FastVisionModel.for_inference(model)

    try:
        # Read the image file and convert it to a PIL Image
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        pil_image = pil_image.resize((512, 512))

        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")

        # Format the prompt using the chat template
        messages = [
            {"role": "user", "content": [
                {"type": "image"},
                {"type": "text", "text": PROMPT_FOR_VISION}
            ]}
        ]
        
        input_text = tokenizer.apply_chat_template(messages, add_generation_prompt=True)

        # Prepare inputs for the model using the tokenizer
        inputs = tokenizer(
            images=pil_image,
            text=input_text,
            add_special_tokens=False,
            return_tensors="pt",
        ).to("cuda" if torch.cuda.is_available() else "cpu")
        
        # Configure the streamer for real-time output
        streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

        # Define generation arguments from the example
        generation_kwargs = dict(
            **inputs,
            streamer=streamer,
            max_new_tokens=2048,
            temperature=1.0,
            top_p=0.95,
            top_k=64,
            use_cache=True,
        )
        
        # Generate the response in a separate thread
        thread = Thread(target=model.generate, kwargs=generation_kwargs)
        thread.start()

        # Stream the generated tokens back to the client
        def stream_generator():
            try:
                for new_text in streamer:
                    if new_text:
                        yield new_text
            except Exception as e:
                print(f"Streaming error: {e}")
                
        return StreamingResponse(stream_generator(), media_type="text/plain")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")