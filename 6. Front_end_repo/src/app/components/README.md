# Components

This directory contains reusable React components for the Hand Tracker Photo App.

## MediaPipeStatus.js

A component that displays the current status of MediaPipe loading and initialization.

### Props:
- `mediaPipeLoaded` (boolean): Whether MediaPipe libraries are loaded
- `mediaPipeLoading` (boolean): Whether MediaPipe is currently loading
- `handsInitialized` (boolean): Whether hand tracking is initialized

### Usage:
```jsx
<MediaPipeStatus 
  mediaPipeLoaded={mediaPipeLoaded}
  mediaPipeLoading={mediaPipeLoading}
  handsInitialized={handsInitialized}
/>
```

## MediaPipeLoader.js

A component that handles MediaPipe loading and initialization (alternative to the hook approach).

### Props:
- `onMediaPipeLoaded` (function): Callback when MediaPipe is loaded
- `onHandsInitialized` (function): Callback when hands are initialized
- `onError` (function): Callback when an error occurs

### Returns:
- `mediaPipeLoaded` (boolean): Loading status
- `handsInitialized` (boolean): Initialization status
- `loading` (boolean): Overall loading state
- `initializeHands` (function): Function to initialize hand tracking
- `cleanup` (function): Cleanup function
- `handsRef` (ref): Reference to hands instance
- `cameraRef` (ref): Reference to camera instance 