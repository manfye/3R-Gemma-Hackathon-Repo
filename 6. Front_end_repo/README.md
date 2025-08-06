# Hand Tracker Photo App - Garbage Classification

An AI-powered garbage classification system that uses computer vision and hand tracking to automatically capture photos and classify waste items.

## Features
- 🤚 **Hand Detection**: Uses MediaPipe to detect hand presence in real-time
- ⏱️ **Countdown Timer**: 3-2-1 countdown when hand is detected
- 📸 **Auto Photo Capture**: Automatically captures photos after countdown
- 🤖 **AI Classification**: Uses OpenAI API to classify garbage types
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, JavaScript
- **Styling**: Tailwind CSS
- **Hand Tracking**: MediaPipe Hands
- **AI**: OpenAI GPT-4 Vision API
- **Camera**: WebRTC API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Security Note**: The API key is kept secure on the server side and never exposed to the client.

Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### Camera Issues
- Ensure you're using HTTPS (required for camera access)
- Check browser permissions for camera access
- Try refreshing the page

### Hand Detection Issues
- Ensure good lighting conditions
- Keep your hand clearly visible in the camera
- Try different hand positions

### API Errors
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you're using a supported model

## Development

### Project Structure

```
src/
├── app/
│   ├── page.js          # Main application component
│   ├── layout.js        # Root layout
│   └── globals.css      # Global styles
```

### Key Components

- **Hand Detection**: Uses MediaPipe Hands for real-time hand tracking
- **Countdown Timer**: Manages 3-2-1 countdown with visual feedback
- **Photo Capture**: Captures high-quality images for AI analysis
- **OpenAI Integration**: Sends images to GPT-4 Vision for classification
- **Results Display**: Shows classification results with proper disposal info

### Performance Optimizations

- Hand detection runs at 60fps
- Image capture optimized for 720p quality
- API calls include error handling and retry logic
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all dependencies are properly installed
