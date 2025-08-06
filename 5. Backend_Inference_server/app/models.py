import torch
from unsloth import FastVisionModel

models = {}

def load_models():
    """
    Loads the Gemma vision models and tokenizers using Unsloth and stores them in the global `models` dictionary.
    """
    print("Loading Gemma VLM models...")

    # Model IDs
    model_e2b_id = "qizunlee/gemma3n_E2B_it_ft_3RGarbageClassification"
    model_e4b_id = "qizunlee/gemma3n_E4B_it_ft_3RGarbageClassification"

    try:
        # Load E2B model and its tokenizer
        model_e2b, tokenizer_e2b = FastVisionModel.from_pretrained(
            model_e2b_id,
            dtype = None,
            load_in_4bit=True,
            max_seq_length = 1024,
            use_gradient_checkpointing="unsloth",
            device_map = "auto",
        )
        
        # Load E4B model and its tokenizer
        model_e4b, tokenizer_e4b = FastVisionModel.from_pretrained(
            model_e4b_id,
            dtype = None,
            load_in_4bit=True,
            max_seq_length = 1024,
            use_gradient_checkpointing="unsloth",
            device_map = "auto",
        )
        
        # Store models and tokenizers in the global dictionary
        models["e2b"] = {"model": model_e2b, "tokenizer": tokenizer_e2b}
        models["e4b"] = {"model": model_e4b, "tokenizer": tokenizer_e4b}

        print("Models loaded successfully!")

    except Exception as e:
        print(f"Failed to load models: {e}")
        # Optionally re-raise the exception or handle it
        raise