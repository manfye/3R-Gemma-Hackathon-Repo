'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import useMediaPipe from './hooks/useMediaPipe';
import MediaPipeStatus from './components/MediaPipeStatus';

export default function Home() {
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [currentCamera, setCurrentCamera] = useState('environment'); // 'user' for front, 'environment' for back
  const [availableCameras, setAvailableCameras] = useState([]);
  const [switchingCamera, setSwitchingCamera] = useState(false);
  const [useLocalAPI, setUseLocalAPI] = useState(false);
  const [localApiUrl, setLocalApiUrl] = useState('');
  const [showApiUrlInput, setShowApiUrlInput] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isProcessingRef = useRef(false);
  const handDetectionStartRef = useRef(null);
  const stabilityTimeoutRef = useRef(null);
  const isHandDetectedRef = useRef(false);

  // Use MediaPipe hook
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



  // Check if hand is in grabbing position (fingers closed)
  const isHandGrabbing = useCallback((landmarks) => {
    if (!landmarks || landmarks.length < 21) {
      console.log('❌ Hand grabbing check: Invalid landmarks', { landmarks: landmarks?.length || 0 });
      return false;
    }

    // Hand landmark indices for fingertips and finger joints
    const fingerTips = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky tips
    const fingerJoints = [3, 6, 10, 14, 18]; // Corresponding joints
    
    let closedFingers = 0;
    const fingerStates = [];
    
    // Check each finger (except thumb which has different logic)
    for (let i = 1; i < fingerTips.length; i++) {
      const tipY = landmarks[fingerTips[i]].y;
      const jointY = landmarks[fingerJoints[i]].y;
      const isClosed = tipY > jointY;
      
      fingerStates.push({
        finger: ['index', 'middle', 'ring', 'pinky'][i-1],
        tipY: tipY.toFixed(3),
        jointY: jointY.toFixed(3),
        closed: isClosed
      });
      
      // If tip is below joint, finger is likely closed
      if (isClosed) {
        closedFingers++;
      }
    }
    
    // Check thumb separately (horizontal movement)
    const thumbTip = landmarks[4];
    const thumbJoint = landmarks[3];
    const thumbDistance = Math.abs(thumbTip.x - thumbJoint.x);
    
    const thumbState = {
      tipX: thumbTip.x.toFixed(3),
      jointX: thumbJoint.x.toFixed(3),
      distance: thumbDistance.toFixed(3),
      closeToPhone: thumbDistance < 0.05
    };
    
    const isGrabbing = thumbDistance < 0.05 && closedFingers >= 2;
    
    // Only log detailed analysis when hand is actually grabbing
    if (isGrabbing) {
      console.log('🖐️ Hand analysis:', {
        closedFingers,
        thumbState,
        fingerStates,
        isGrabbing,
        threshold: '2+ fingers + thumb close'
      });
    }
    
    return isGrabbing;
  }, []);

  // Handle MediaPipe results
  const onResults = useCallback((results) => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx || !canvasRef.current || !videoRef.current) return;

    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Only log MediaPipe results when hands are detected
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      console.log('📷 MediaPipe results:', {
        handsDetected: results.multiHandLandmarks.length,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    // Draw hand landmarks
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      console.log('✋ Processing hands:', results.multiHandLandmarks.length);
      
      for (const landmarks of results.multiHandLandmarks) {
        console.log('🔍 Analyzing hand landmarks...');
        
        // Check if hand is grabbing something
        const isGrabbing = isHandGrabbing(landmarks);
        
        // Only log state updates when hand is grabbing
        if (isGrabbing) {
          console.log('📊 Hand state update:', {
            isGrabbing,
            currentHandDetected: isHandDetected,
            countdown,
            isCapturing,
            isProcessing
          });
        }
        
        // Draw connections in different colors based on grabbing state
        window.drawConnectors(canvasCtx, landmarks, window.Hands.HAND_CONNECTIONS, {
          color: isGrabbing ? '#FFD700' : '#00FF00', // Gold if grabbing, green if open
          lineWidth: 2
        });
        window.drawLandmarks(canvasCtx, landmarks, {
          color: isGrabbing ? '#FF4500' : '#FF0000', // Orange if grabbing, red if open
          lineWidth: 1,
          radius: 3
        });
        
        // Update hand detection state
        if (isGrabbing) {
          console.log('🎯 Setting hand detected:', isGrabbing);
        }
        setIsHandDetected(isGrabbing);
        isHandDetectedRef.current = isGrabbing;

        // Hand presence tracking logic
        const now = Date.now();
        
        if (isGrabbing) {
          // Hand is detected and grabbing
          if (handDetectionStartRef.current === null) {
            // First detection - start tracking
            handDetectionStartRef.current = now;
            console.log('👋 Hand grabbing started - beginning stability check');
            
            // Clear any existing timeout
            if (stabilityTimeoutRef.current) {
              clearTimeout(stabilityTimeoutRef.current);
            }
            
                         // Set timeout for 1 second stability check
             stabilityTimeoutRef.current = setTimeout(() => {
               console.log('✅ Hand stable for 1 second - ready to start countdown');
               
               // Check if conditions are still met and hand is still detected
               console.log('🔍 Checking conditions for countdown:', {
                 isHandDetected: isHandDetectedRef.current,
                 countdown,
                 isCapturing,
                 isProcessing,
                 isProcessingRef: isProcessingRef.current,
                 handDetectionStart: handDetectionStartRef.current
               });
               
               if (isHandDetectedRef.current && countdown === null && !isCapturing && !isProcessing && !isProcessingRef.current) {
                 console.log('🚀 Starting countdown after stability check');
                 startCountdown();
                                } else {
                   console.log('🚫 Conditions changed during stability check:', {
                     isHandDetected: isHandDetectedRef.current,
                     countdown,
                     isCapturing,
                     isProcessing,
                     isProcessingRefCurrent: isProcessingRef.current
                   });
                 }
             }, 1000); // 1 second stability requirement
            
          } else {
            // Hand continues to be detected
            const handDuration = now - handDetectionStartRef.current;
            console.log('⏰ Hand grabbing duration:', handDuration, 'ms');
          }
          
        } else {
          // Hand not grabbing or not detected
          if (handDetectionStartRef.current !== null) {
            console.log('❌ Hand lost - cancelling countdown');
            cancelCountdown(); // This will reset handDetectionStartRef and clear timeouts
          }
        }
      }
    } else {
      // Only log when transitioning from detected to not detected
      if (isHandDetected) {
        console.log('👻 No hands detected - transitioning from detected state');
        console.log('🎯 Setting hand detected: false');
      }
      setIsHandDetected(false);
      isHandDetectedRef.current = false;
      
      // Cancel countdown and reset tracking if no hand detected
      if (handDetectionStartRef.current !== null || countdown !== null) {
        console.log('❌ Cancelling countdown - no hands detected');
        cancelCountdown();
      }
    }

    canvasCtx.restore();
  }, [countdown, isCapturing, isProcessing, isHandGrabbing, isHandDetected]);

  // Demo hand detection (simplified for demo purposes)
  const startDemoHandDetection = useCallback(() => {
    setShowDemo(true);
    setIsHandDetected(true);
    startCountdown();
  }, []);

  // Get available cameras
  const getAvailableCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      console.log('Available cameras:', videoDevices);
    } catch (err) {
      console.error('Error getting cameras:', err);
    }
  }, []);

  // Switch camera
  const switchCamera = useCallback(async () => {
    try {
      setSwitchingCamera(true);
      
      // Stop current camera and hands
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }

      // Toggle camera
      const newCamera = currentCamera === 'environment' ? 'user' : 'environment';
      setCurrentCamera(newCamera);

      // Get new stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newCamera,
          width: 1280,
          height: 720
        }
      });

      // Update video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Reinitialize MediaPipe hands if already loaded
      if (mediaPipeLoaded && !handsInitialized) {
        setTimeout(() => {
          initializeHands(videoRef, canvasRef, onResults);
        }, 1000); // Wait for video to be ready
      }

      console.log('Switched to camera:', newCamera);
    } catch (err) {
      console.error('Error switching camera:', err);
      setError('Failed to switch camera. Please try again.');
    } finally {
      setSwitchingCamera(false);
    }
  }, [currentCamera, mediaPipeLoaded, handsInitialized, initializeHands]);

  // Start countdown (hand must stay for 3 seconds total)
  const startCountdown = useCallback(() => {
    // Prevent multiple countdowns
    if (countdown !== null || isCapturing || isProcessing) {
      console.log('🚫 Countdown blocked - already active or processing');
      return;
    }
    
    console.log('🚀 Starting 3-second countdown');
    setCountdown(3);
    setError(null);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          console.log('📸 Countdown complete - capturing photo');
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          capturePhoto();
          return null;
        }
        console.log(`⏱️ Countdown: ${prev - 1}`);
        return prev - 1;
      });
    }, 1000);
  }, [countdown, isCapturing, isProcessing]);

  // Cancel countdown and reset hand tracking
  const cancelCountdown = useCallback(() => {
    console.log('❌ Cancelling countdown and resetting hand tracking');
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
      stabilityTimeoutRef.current = null;
    }
    
    setCountdown(null);
    handDetectionStartRef.current = null;
  }, []);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!canvasRef.current || !videoRef.current || isCapturing || isProcessing) return;

    setIsCapturing(true);
    
    // Create a canvas to capture the photo
    const captureCanvas = document.createElement('canvas');
    const captureCtx = captureCanvas.getContext('2d');
    
    if (!captureCtx) {
      setIsCapturing(false);
      return;
    }

    captureCanvas.width = videoRef.current.videoWidth || 1280;
    captureCanvas.height = videoRef.current.videoHeight || 720;
    captureCtx.drawImage(videoRef.current, 0, 0);

    // Convert to blob
    captureCanvas.toBlob(async (blob) => {
      if (!blob) {
        setIsCapturing(false);
        return;
      }

      await classifyGarbage(blob);
      setIsCapturing(false);
    }, 'image/jpeg', 0.9);
  }, [isCapturing, isProcessing]);

  // Classify garbage using secure API
  const classifyGarbage = useCallback(async (imageBlob) => {
    // Prevent multiple simultaneous API calls using both state and ref
    if (isProcessing || isProcessingRef.current) {
      console.log('Already processing, skipping API call');
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);
    setError(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          const base64Data = base64Image.split(',')[1];

          console.log('Making API call to classify image');

          // Choose API endpoint based on user selection
          const apiEndpoint = useLocalAPI ? '/api/classify/local' : '/api/classify';
          const requestBody = useLocalAPI 
            ? {
                imageBase64: base64Data,
                apiUrl: localApiUrl
              }
            : {
                imageBase64: base64Data
              };

          // Call our secure backend API
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to classify image');
          }

          const result = await response.json();
          console.log('API response received:', result);
          setResult(result);
                 } catch (err) {
           console.error('Error in API call:', err);
           setError('Failed to classify the image. Please try again.');
         } finally {
           isProcessingRef.current = false;
           setIsProcessing(false);
         }
       };

       reader.onerror = () => {
         console.error('Error reading image file');
         setError('Failed to read image file.');
         isProcessingRef.current = false;
         setIsProcessing(false);
       };

       reader.readAsDataURL(imageBlob);
    } catch (err) {
      console.error('Error in classifyGarbage:', err);
      setError('Failed to classify the image. Please try again.');
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [isProcessing]);

  // Reset the app
  const resetApp = useCallback(() => {
    console.log('🔄 Resetting app - clearing all states and timers');
    
    setResult(null);
    setError(null);
    setCountdown(null);
    setShowDemo(false);
    setIsHandDetected(false);
    setIsCapturing(false);
    setIsProcessing(false);
    isProcessingRef.current = false;
    isHandDetectedRef.current = false;
    handDetectionStartRef.current = null;
    
    // Clear all timers
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
      stabilityTimeoutRef.current = null;
    }
  }, []);

  // Handle API mode toggle
  const toggleApiMode = useCallback(() => {
    setUseLocalAPI(!useLocalAPI);
    if (!useLocalAPI) {
      // Switching to local API - show input
      setShowApiUrlInput(true);
    } else {
      // Switching to web API - hide input
      setShowApiUrlInput(false);
      setLocalApiUrl('');
    }
  }, [useLocalAPI]);

  // Handle local API URL submission
  const handleApiUrlSubmit = useCallback(() => {
    if (localApiUrl.trim()) {
      setShowApiUrlInput(false);
      setError(null);
    } else {
      setError('Please enter a valid API URL');
    }
  }, [localApiUrl]);

  // Initialize MediaPipe when loaded
  useEffect(() => {
    if (mediaPipeLoaded && !handsInitialized) {
      initializeHands(videoRef, canvasRef, onResults);
      setCameraStarted(true);
    }
  }, [mediaPipeLoaded, handsInitialized, initializeHands]);

  // Handle MediaPipe errors
  useEffect(() => {
    if (mediaPipeError) {
      setError(mediaPipeError);
    }
  }, [mediaPipeError]);

  // Get available cameras on mount
  useEffect(() => {
    getAvailableCameras();
  }, [getAvailableCameras]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleanup - clearing timers');
      
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (stabilityTimeoutRef.current) {
        clearTimeout(stabilityTimeoutRef.current);
      }
    };
  }, []);

  // Debug: Monitor hand detection state changes (only when becoming true)
  useEffect(() => {
    if (isHandDetected) {
      console.log('🔄 Hand detection state changed:', {
        isHandDetected,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }, [isHandDetected]);

  // Debug: Monitor countdown state changes
  useEffect(() => {
    console.log('⏰ Countdown state changed:', {
      countdown,
      timestamp: new Date().toLocaleTimeString()
    });
  }, [countdown]);

  // Debug: Monitor processing state changes
  useEffect(() => {
    console.log('⚙️ Processing state changed:', {
      isProcessing,
      isCapturing,
      timestamp: new Date().toLocaleTimeString()
    });
  }, [isProcessing, isCapturing]);

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-screen">
        {/* Camera Section - Full Screen */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={1280}
            height={720}
          />
          
          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-8xl font-bold text-white animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {/* Capture Flash Effect */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white bg-opacity-80 animate-pulse" />
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-xl">Analyzing image...</p>
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              cameraStarted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              Camera: {cameraStarted ? 'Active' : 'Starting...'}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isHandDetected 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              Hand: {isHandDetected ? 'Grabbing Object' : 'Open/Not Detected'}
            </div>
            <MediaPipeStatus 
              mediaPipeLoaded={mediaPipeLoaded}
              mediaPipeLoading={mediaPipeLoading}
              handsInitialized={handsInitialized}
            />
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              useLocalAPI 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              API: {useLocalAPI ? 'Local' : 'Web'}
            </div>
         
          </div>

          {/* Camera Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {/* API Mode Toggle */}
            <button
              onClick={toggleApiMode}
              className={`font-medium py-2 px-3 rounded-lg transition-colors flex items-center space-x-1 ${
                useLocalAPI 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title={`Switch to ${useLocalAPI ? 'Web' : 'Local'} API`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">
                {useLocalAPI ? 'use Web API' : 'use Local API'}
              </span>
            </button>

            {/* Camera Switch Button */}
            {availableCameras.length > 1 && (
              <button
                onClick={switchCamera}
                disabled={switchingCamera}
                className={`font-medium py-2 px-3 rounded-lg transition-colors flex items-center space-x-1 ${
                  switchingCamera 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
                title={`Switch to ${currentCamera === 'environment' ? 'front' : 'back'} camera`}
              >
                {switchingCamera ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-1.707-1.707A1 1 0 0010.414 3H9.586a1 1 0 00-.707.293L7.086 5H4zm6 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-xs">
                  {switchingCamera ? 'Switching...' : (currentCamera === 'environment' ? 'Front' : 'Back')}
                </span>
              </button>
            )}

            {/* Demo Button */}
            {!showDemo && !isHandDetected && !mediaPipeLoaded && !mediaPipeLoading && (
              <button
                onClick={startDemoHandDetection}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Demo: Simulate Hand Detection
              </button>
            )}
          </div>

          {/* API URL Input Modal */}
          {showApiUrlInput && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Enter Local API URL</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Please enter the URL of your local API endpoint (e.g., http://localhost:8000/classify)
                </p>
                <div className="space-y-4">
                  <input
                    type="url"
                    value={localApiUrl}
                    onChange={(e) => setLocalApiUrl(e.target.value)}
                    placeholder="http://localhost:8000/classify"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleApiUrlSubmit();
                      }
                    }}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleApiUrlSubmit}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Use Local API
                    </button>
                    <button
                      onClick={() => {
                        setShowApiUrlInput(false);
                        setUseLocalAPI(false);
                        setLocalApiUrl('');
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 text-center text-white">
            <p className="font-medium text-lg">Grab an object and hold it steady to start the countdown</p>
            <p className="text-sm opacity-90">Hand must stay stable for 1 second, then countdown begins (3-2-1)</p>
            <div className="mt-2 text-xs opacity-75">
              <p>• Hold the object firmly in your closed hand</p>
              <p>• Keep your hand steady for 4 seconds total (1s stability + 3s countdown)</p>
              <p>• Removing hand cancels countdown immediately</p>
              <p>• Hand color: <span className="text-yellow-400 font-medium">Gold</span> = Grabbing, <span className="text-green-400 font-medium">Green</span> = Open</p>
            </div>
          </div>

          {/* Results Overlay */}
          {result && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Classification Results</h2>
                
                {/* Check if all items are unknown */}
                {result.material.every(item => 
                  item.part_name.toLowerCase() === 'unknown'
                ) ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">🤷‍♂️</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Item Not Recognized</h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      The AI couldn&apos;t identify this item clearly. Please try:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 mb-4">
                      <li>• Better lighting conditions</li>
                      <li>• Hold the item closer to the camera</li>
                      <li>• Make sure the item is clearly visible</li>
                      <li>• Try a different angle</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.material.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700 text-sm">
                            Part: {item.part_name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.answer.includes('Paper') || item.answer.includes('D:') ? 'bg-blue-100 text-blue-800' :
                            item.answer.includes('Plastic') || item.answer.includes('E:') ? 'bg-green-100 text-green-800' :
                            item.answer.includes('Glass') || item.answer.includes('B:') ? 'bg-purple-100 text-purple-800' :
                            item.answer.includes('Metal') || item.answer.includes('C:') ? 'bg-yellow-100 text-yellow-800' :
                            item.answer.includes('Cardboard') || item.answer.includes('A:') ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.answer}
                          </span>
                        </div>
                        
                        {/* Disposal instructions */}
                        <div className="mt-2 text-xs text-gray-600">
                          {item.answer.includes('Paper') || item.answer.includes('D') ? 
                            '♻️ Dispose in paper recycling bin' :
                          item.answer.includes('Plastic') || item.answer.includes('E') ? 
                            '♻️ Dispose in plastic recycling bin' :
                          item.answer.includes('Glass') || item.answer.includes('B') ? 
                            '♻️ Dispose in glass recycling bin' :
                          item.answer.includes('Metal') || item.answer.includes('C') ? 
                            '♻️ Dispose in metal recycling bin' :
                          item.answer.includes('Cardboard') || item.answer.includes('A') ? 
                            '♻️ Dispose in cardboard recycling bin' :
                            '🗑️ Dispose in general trash bin'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={resetApp}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Take Another Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 max-w-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 