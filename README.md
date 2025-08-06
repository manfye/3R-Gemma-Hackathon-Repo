# 3R Gemma Hackathon - AI-Powered Garbage Classification System

An innovative AI-powered garbage classification system that uses computer vision and hand tracking to automatically capture and classify waste items into recyclable categories. Built with fine-tuned Gemma models and modern web technologies.

## 🌟 Features

- 🤚 **Smart Hand Detection**: Automatic photo capture when hands are detected
- 🔍 **AI Classification**: Classifies waste into 6 categories using fine-tuned Gemma models
- ⚡ **Dual AI Options**: Choose between OpenAI GPT-4 Vision or local Gemma inference
- 📱 **Mobile-Friendly**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface with real-time countdown and visual feedback
- 📊 **Benchmarking Tools**: Comprehensive evaluation and comparison frameworks

## 📋 Waste Categories

The system classifies items into 6 categories:
- **A: Cardboard** - Paper-based packaging materials
- **B: Glass** - Glass containers, bottles, and jars
- **C: Metal** - Metal cans, containers, and foil
- **D: Paper** - Paper documents, newspapers, magazines
- **E: Plastic** - Plastic containers, bottles, and packaging
- **F: Trash** - Non-recyclable waste items

## 🏗️ Repository Structure

```
📁 1. Garbage_classification_benchmark/    # Ground truth dataset and benchmarking
📁 2. LLM_benchmark_notebook/              # Model performance evaluation
📁 3. Finetune_gemma_notebook/             # Gemma model fine-tuning scripts
📁 4. Inference_script_notebook/           # Inference testing notebooks
📁 5. Backend_Inference_server/            # FastAPI backend with Gemma models
📁 6. Front_end_repo/                      # Next.js web application
```

## 🚀 Quick Start

### Option 1: Full System Setup (Recommended)

#### 1. Backend Setup (AI Inference Server)

```bash
cd "5. Backend_Inference_server"

# Create virtual environment (Python 3.11 recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies in specific order (IMPORTANT!)
pip install unsloth
pip install --no-deps --upgrade timm
pip install transformers
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`

#### 2. Frontend Setup (Web Application)

```bash
cd "6. Front_end_repo"

# Install dependencies
npm install

# Create environment file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Frontend Only (OpenAI API)

If you only want to use the frontend with OpenAI:

```bash
cd "6. Front_end_repo"
npm install
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
npm run dev
```

## 💻 System Requirements

### Backend Requirements
- **Python**: 3.11+
- **PyTorch**: 2.7.1+
- **CUDA**: 12.6+ (for GPU acceleration)
- **RAM**: 8GB+ (16GB+ recommended for model loading)
- **GPU**: NVIDIA GPU with 4GB+ VRAM (optional but recommended)

### Frontend Requirements
- **Node.js**: 18+
- **Browser**: Modern browser with camera support
- **HTTPS**: Required for camera access (dev server provides this)

## 📖 How to Use

### Web Application Usage

1. **Launch the Application**
   - Navigate to `http://localhost:3000`
   - Allow camera access when prompted

2. **Choose Classification Method**
   - **"Classify with OpenAI"**: Uses GPT-4 Vision API (requires API key)
   - **"Classify with Gemma"**: Uses local fine-tuned models (requires backend)

3. **Take Photos**
   - Position waste item in camera view
   - Show your hand to trigger 3-2-1 countdown
   - Photo captures automatically after countdown
   - View classification results with disposal recommendations

4. **Review Results**
   - See detailed breakdown of materials detected
   - Get proper disposal guidance for each category
   - Take additional photos as needed

### Development and Research

#### Model Fine-tuning
```bash
# Open the fine-tuning notebook
cd "3. Finetune_gemma_notebook"
jupyter notebook Gemma3n_FT_Trash_Classification.ipynb
```

#### Benchmarking
```bash
# Evaluate model performance
cd "2. LLM_benchmark_notebook"
jupyter notebook benchmark_gemma.ipynb
```

#### Dataset Creation
```bash
# Create custom datasets
cd "1. Garbage_classification_benchmark"
jupyter notebook benchmark_data_creation.ipynb
```

## 🔧 Configuration

### Backend Configuration

The backend automatically loads two fine-tuned models:
- `qizunlee/gemma3n_E2B_it_ft_3RGarbageClassification`
- `qizunlee/gemma3n_E4B_it_ft_3RGarbageClassification`

### Frontend Configuration

Create `.env.local` in the frontend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🛠️ Development Commands

### Backend
```bash
uvicorn app.main:app --reload        # Start development server
uvicorn app.main:app --host 0.0.0.0  # Start server accessible externally
```

### Frontend
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 API Usage

### Health Check
```bash
GET http://127.0.0.1:8000/healthcheck
```

### Classification Endpoint
```bash
POST http://127.0.0.1:8000/gemma3n/inference
Content-Type: multipart/form-data

image: [image file]
model_choice: "e2b" or "e4b"
```

## 🐛 Troubleshooting

### Common Issues

**Backend Issues:**
- Ensure correct installation order of dependencies
- Check CUDA availability for GPU acceleration
- Verify sufficient RAM for model loading

**Frontend Issues:**
- Enable HTTPS for camera access
- Check OpenAI API key validity and credits
- Ensure good lighting for hand detection

**Camera Problems:**
- Grant browser camera permissions
- Try refreshing the page
- Check if camera is being used by another application

## 📊 Model Performance

The fine-tuned Gemma models have been benchmarked against various datasets:
- Ground truth accuracy metrics available in `2. LLM_benchmark_notebook/`
- Comparison with GPT-4 Vision results
- Multi-material classification capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with both backend and frontend
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built for the 3R Gemma Hackathon
- Uses Unsloth for efficient model inference
- Powered by MediaPipe for hand tracking
- Fine-tuned Gemma models by qizunlee

---

**Need Help?** Check the individual README files in each component directory for detailed setup instructions.