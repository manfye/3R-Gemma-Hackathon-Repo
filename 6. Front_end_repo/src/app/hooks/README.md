# Hooks

This directory contains custom React hooks for the Hand Tracker Photo App.

## useMediaPipe.js

A custom hook that manages MediaPipe loading, initialization, and cleanup.

### Returns:
- `mediaPipeLoaded` (boolean): Whether MediaPipe libraries are loaded
- `handsInitialized` (boolean): Whether hand tracking is initialized
- `loading` (boolean): Whether MediaPipe is currently loading
- `error` (string): Any error message from MediaPipe operations
- `initializeHands` (function): Function to initialize hand tracking
- `cleanup` (function): Cleanup function for MediaPipe resources
- `handsRef` (ref): Reference to hands instance
- `cameraRef` (ref): Reference to camera instance

### Usage:
```jsx
const {
  mediaPipeLoaded,
  handsInitialized,
  loading: mediaPipeLoading,
  error: mediaPipeError,
  initializeHands,
  cleanup: mediaPipeCleanup,
  handsRef,
  cameraRef
} = useMediaPipe();
```

### Features:
- Automatic MediaPipe library loading from CDN
- Hand tracking initialization
- Camera setup and management
- Error handling and cleanup
- Memory leak prevention 