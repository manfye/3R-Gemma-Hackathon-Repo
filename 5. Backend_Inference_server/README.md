# Gemma-3R Inference API

This project provides a FastAPI backend for the Gemma-3R model, offering an inference endpoint that can be connected to a frontend. The API uses Unsloth to run the Gemma vision models and provides a simple interface for image-based garbage classification.

## Project Structure

```
.
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   └── routers
│       ├── __init__.py
│       └── generation.py
└── requirements.txt
```

- **`app/main.py`**: The main entry point for the FastAPI application. It handles application startup, loads the models, and includes the API routers.
- **`app/models.py`**: This module is responsible for loading the Gemma vision models and tokenizers using Unsloth.
- **`app/routers/generation.py`**: Defines the `/gemma3n/inference` endpoint, which handles the image-based inference requests.
- **`requirements.txt`**: A list of the Python dependencies for this project.

## Installation

This project was tested with **Python 3.11**, **torch 2.7.1**, and **CUDA 12.6**.

1. **Create a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
2. **Install dependencies in the correct order:**

   It is crucial to install the packages in the following order to avoid dependency conflicts:

   ```bash
   pip install unsloth
   pip install --no-deps --upgrade timm
   pip install transformers
   pip install -r requirements.txt
   ```

## Running the Backend

To start the FastAPI backend, run the following command in your terminal:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Endpoints

### Health Check

- **GET /healthcheck**

  Returns a status message to confirm that the API is running and the models are loaded.

### Gemma3N Inference

- **POST /gemma3n/inference**

  This endpoint accepts an image and a model choice and returns a JSON response with the garbage classification.

  - **Request:**

    - `image`: An uploaded image file.
    - `model_choice`: A string indicating the model to use (`e2b` or `e4b`).
  - **Response:**

    - A streaming response of a JSON object with the classification results.

## Technologies Used

- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python.
- **Unsloth**: A library for running large language models with less memory.
- **PyTorch**: An open-source machine learning framework.
- **Transformers**: A library for natural language processing and computer vision models.
- **Pillow**: A library for opening, manipulating, and saving many different image file formats.
