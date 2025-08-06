# Setup Guide - Hand Tracker Photo App

## Quick Start

The app is currently running with MediaPipe loaded via CDN. To enable full functionality, follow these steps:

### 1. Fix PowerShell Execution Policy (if needed)

If you get a PowerShell execution policy error, run this in PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Dependencies

Run this command in your terminal:

```bash
npm install openai
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Use `OPENAI_API_KEY` (not `NEXT_PUBLIC_OPENAI_API_KEY`) to keep your API key secure on the server side.

Get your API key from: https://platform.openai.com/api-keys

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Current Features

✅ **Working Now:**
- Camera access and video display
- MediaPipe hand detection (loaded via CDN)
- 3-2-1 countdown timer when hand is detected
- Photo capture functionality
- OpenAI API integration for real classification
- Beautiful UI with Tailwind CSS
- Error handling and user feedback
- Real-time hand landmark visualization

🚀 **Full Functionality:**
- Real-time hand detection using MediaPipe
- Automatic countdown when hand is detected
- Real AI classification using OpenAI GPT-4 Vision
- Hand landmark visualization
- Proper error handling for API calls

## How to Use

1. **Allow Camera Access**: When prompted, allow the app to access your camera
2. **Show Your Hand**: Position your hand in front of the camera
3. **Wait for Countdown**: The app will start a 3-2-1 countdown when hand is detected
4. **Photo Capture**: After countdown, a photo will be automatically captured
5. **View Results**: The AI will classify the garbage and show results
6. **Retake**: Click "Take Another Photo" to try again

## Garbage Categories

The app classifies items into 6 categories:
- **A: Cardboard** - Paper-based packaging
- **B: Glass** - Glass containers and bottles
- **C: Metal** - Metal cans and containers
- **D: Paper** - Paper items and documents
- **E: Plastic** - Plastic containers and packaging
- **F: Trash** - Non-recyclable items

## API Response Format

The app expects OpenAI to return JSON in this format:

```json
{
  "material": [
    {
      "part_name": "cup",
      "answer": "D: Paper"
    },
    {
      "part_name": "lid",
      "answer": "E: Plastic"
    }
  ]
}
```

## Troubleshooting

### PowerShell Issues
- Run PowerShell as Administrator
- Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Try again

### Camera Not Working
- Ensure you're using HTTPS (required for camera access)
- Check browser permissions for camera access
- Try refreshing the page

### Hand Detection Issues
- Ensure good lighting conditions
- Keep your hand clearly visible in the camera
- Try different hand positions
- Check MediaPipe status indicator

### API Errors
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you're using a supported model

### MediaPipe Loading Issues
- Check internet connection (MediaPipe loads from CDN)
- Try refreshing the page
- Check browser console for errors

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Technical Details

### MediaPipe Integration
- Loaded via CDN for reliability
- Real-time hand landmark detection
- Automatic countdown trigger
- Visual hand tracking overlay

### OpenAI Integration
- GPT-4 Vision model for image analysis
- Structured JSON response parsing
- Error handling for API failures
- Fallback to demo mode if API key missing

### Performance Optimizations
- Hand detection runs at 60fps
- Image capture optimized for 720p quality
- API calls include error handling and retry logic
- Responsive design for all screen sizes

## Next Steps

1. Install the dependencies listed above
2. Add your OpenAI API key to `.env.local`
3. Run the development server
4. Test with real hand detection and AI classification

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all dependencies are properly installed
3. Ensure your OpenAI API key is valid
4. Try refreshing the page and allowing camera permissions
5. Check the MediaPipe status indicator 