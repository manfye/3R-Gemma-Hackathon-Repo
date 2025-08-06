'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export default function useMediaPipe() {
  const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false);
  const [handsInitialized, setHandsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  // Load MediaPipe from CDN
  const loadMediaPipe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading MediaPipe libraries...');

      // Load MediaPipe scripts
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
      await new Promise((resolve, reject) => {
        script1.onload = resolve;
        script1.onerror = reject;
        document.head.appendChild(script1);
      });

      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
      await new Promise((resolve, reject) => {
        script2.onload = resolve;
        script2.onerror = reject;
        document.head.appendChild(script2);
      });

      const script3 = document.createElement('script');
      script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
      await new Promise((resolve, reject) => {
        script3.onload = resolve;
        script3.onerror = reject;
        document.head.appendChild(script3);
      });

      setMediaPipeLoaded(true);
      console.log('MediaPipe libraries loaded successfully');
    } catch (err) {
      console.error('Failed to load MediaPipe:', err);
      setError('Failed to load MediaPipe. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize MediaPipe Hands
  const initializeHands = useCallback((videoRef, canvasRef, onResults) => {
    if (!videoRef.current || !canvasRef.current || !mediaPipeLoaded) return;

    try {
      console.log('Initializing MediaPipe Hands...');
      
      handsRef.current = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      handsRef.current.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      handsRef.current.onResults(onResults);

      // Initialize camera
      cameraRef.current = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });

      cameraRef.current.start();
      setHandsInitialized(true);
      console.log('MediaPipe Hands initialized successfully');
    } catch (err) {
      console.error('Failed to initialize MediaPipe:', err);
      setError('Failed to initialize hand tracking. Please refresh the page.');
    }
  }, [mediaPipeLoaded]);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 MediaPipe cleanup - stopping camera and hands');
    
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    
    if (handsRef.current) {
      handsRef.current.close();
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadMediaPipe();

    return () => {
      cleanup();
    };
  }, [loadMediaPipe, cleanup]);

  return {
    mediaPipeLoaded,
    handsInitialized,
    loading,
    error,
    initializeHands,
    cleanup,
    handsRef,
    cameraRef
  };
} 