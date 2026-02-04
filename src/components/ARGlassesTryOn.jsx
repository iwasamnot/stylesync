import React, { useRef, useState, useEffect, useCallback } from 'react'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs'

// AR Glasses Try-On Component
function ARGlassesTryOn({ 
  glassesModelUrl,
  onCapture,
  className = '',
  style = {}
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [detector, setDetector] = useState(null)
  const [error, setError] = useState('')
  const [isGlassesPlaced, setIsGlassesPlaced] = useState(false)
  const [cameraPermission, setCameraPermission] = useState('prompt') // 'prompt', 'granted', 'denied'
  const streamRef = useRef(null)

  // Check camera permissions
  const checkCameraPermissions = useCallback(async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' })
      setCameraPermission(permissions.state)
      
      // Listen for permission changes
      permissions.addEventListener('change', () => {
        setCameraPermission(permissions.state)
      })
    } catch (err) {
      // Some browsers don't support permissions API
      console.log('Permissions API not supported')
    }
  }, [])

  // Initialize camera permissions check
  useEffect(() => {
    checkCameraPermissions()
  }, [checkCameraPermissions])

  // Initialize face detection
  useEffect(() => {
    const initializeDetector = async () => {
      try {
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
        const detectorConfig = {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1
        }
        
        const detectorInstance = await faceLandmarksDetection.createDetector(model, detectorConfig)
        setDetector(detectorInstance)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to initialize face detection')
        setIsLoading(false)
      }
    }

    initializeDetector()
  }, [])

  // Start camera
  const startCamera = useCallback(async () => {
    console.log('AR: Starting camera...')
    try {
      // Check if running on HTTPS or localhost
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setError('Camera access requires HTTPS or localhost. Please use https://localhost:5173 or deploy to HTTPS.')
        return
      }

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported by your browser')
        return
      }

      console.log('AR: Requesting camera access...')

      // Request camera with more compatible constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        },
        audio: false // We don't need audio
      })
      
      console.log('AR: Camera access granted, setting up video element')
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
        setError('')
        console.log('AR: Camera setup complete')
        
        // Add video event listeners
        videoRef.current.addEventListener('loadedmetadata', () => {
          console.log('AR: Video metadata loaded, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
        })
        
        videoRef.current.addEventListener('canplay', () => {
          console.log('AR: Video can play')
        })
        
        videoRef.current.addEventListener('error', (e) => {
          console.error('AR: Video error:', e)
          setError('Video error occurred. Please try again.')
        })
        
        videoRef.current.addEventListener('ended', () => {
          console.log('AR: Video stream ended')
          setIsCameraActive(false)
        })
      }
    } catch (err) {
      console.error('AR: Camera access error:', err)
      
      // Provide specific error messages and retry suggestions
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please allow camera access in your browser settings and try again.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please connect a camera and try again.')
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application. Please close other apps using the camera and try again.')
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        setError('Camera does not support the requested settings. Trying with basic settings...')
        // Retry with basic settings
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          })
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream
            streamRef.current = basicStream
            setIsCameraActive(true)
            setError('')
            console.log('AR: Camera started with basic settings')
          }
        } catch (basicErr) {
          setError('Camera access failed even with basic settings. Please check your camera and browser permissions.')
        }
      } else if (err.name === 'TypeError') {
        setError('Camera access is not supported in this browser or context.')
      } else {
        setError(`Camera access failed: ${err.message || 'Unknown error'}`)
      }
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setIsCameraActive(false)
    }
  }, [])

  // Detect face and place glasses
  const detectFaceAndPlaceGlasses = useCallback(async () => {
    if (!detector || !videoRef.current || !canvasRef.current) {
      console.log('AR: Missing detector, video, or canvas')
      return
    }

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      console.log('AR: Video readyState:', video.readyState)

      // Wait for video to be ready
      if (video.readyState !== 4) {
        console.log('AR: Video not ready yet')
        return
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      
      console.log('AR: Canvas size:', canvas.width, 'x', canvas.height)

      // Detect face landmarks
      const faces = await detector.estimateFaces(video)
      
      console.log('AR: Faces detected:', faces.length)
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      if (faces.length > 0) {
        const face = faces[0]
        const keypoints = face.keypoints
        
        console.log('AR: Face keypoints:', keypoints.length)
        
        // Find eye landmarks for glasses placement
        const leftEye = keypoints[33]  // Left eye corner
        const rightEye = keypoints[263] // Right eye corner
        const noseBridge = keypoints[6] // Nose bridge
        
        console.log('AR: Eye positions - Left:', leftEye, 'Right:', rightEye, 'Nose:', noseBridge)
        
        if (leftEye && rightEye && noseBridge) {
          // Calculate glasses position and size
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) + 
            Math.pow(rightEye.y - leftEye.y, 2)
          )
          
          const glassesWidth = eyeDistance * 2.5
          const glassesHeight = glassesWidth * 0.4
          
          // Position glasses centered on eyes
          const glassesX = (leftEye.x + rightEye.x) / 2 - glassesWidth / 2
          const glassesY = noseBridge.y - glassesHeight / 2
          
          console.log('AR: Glasses position - X:', glassesX, 'Y:', glassesY, 'Width:', glassesWidth)
          
          // Draw glasses with better styling
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 4
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
          
          // Left lens with rounded corners
          ctx.beginPath()
          ctx.roundRect(glassesX, glassesY, glassesWidth * 0.45, glassesHeight, 8)
          ctx.fill()
          ctx.stroke()
          
          // Right lens with rounded corners
          ctx.beginPath()
          ctx.roundRect(glassesX + glassesWidth * 0.55, glassesY, glassesWidth * 0.45, glassesHeight, 8)
          ctx.fill()
          ctx.stroke()
          
          // Bridge
          ctx.beginPath()
          ctx.moveTo(glassesX + glassesWidth * 0.45, glassesY + glassesHeight * 0.3)
          ctx.lineTo(glassesX + glassesWidth * 0.55, glassesY + glassesHeight * 0.3)
          ctx.stroke()
          
          // Left temple
          ctx.beginPath()
          ctx.moveTo(glassesX, glassesY + glassesHeight * 0.3)
          ctx.lineTo(glassesX - 25, glassesY + glassesHeight * 0.3)
          ctx.lineWidth = 3
          ctx.stroke()
          
          // Right temple
          ctx.beginPath()
          ctx.moveTo(glassesX + glassesWidth, glassesY + glassesHeight * 0.3)
          ctx.lineTo(glassesX + glassesWidth + 25, glassesY + glassesHeight * 0.3)
          ctx.stroke()
          
          // Add lenses effect
          ctx.fillStyle = 'rgba(100, 150, 200, 0.3)'
          ctx.beginPath()
          ctx.roundRect(glassesX + 2, glassesY + 2, glassesWidth * 0.45 - 4, glassesHeight - 4, 6)
          ctx.fill()
          
          ctx.beginPath()
          ctx.roundRect(glassesX + glassesWidth * 0.55 + 2, glassesY + 2, glassesWidth * 0.45 - 4, glassesHeight - 4, 6)
          ctx.fill()
          
          setIsGlassesPlaced(true)
          
          // Add debug info
          ctx.fillStyle = '#00ff00'
          ctx.font = '12px Arial'
          ctx.fillText('✓ Face detected', 10, 20)
        } else {
          setIsGlassesPlaced(false)
          // Add debug info
          ctx.fillStyle = '#ffff00'
          ctx.font = '12px Arial'
          ctx.fillText('Face detected but landmarks not found', 10, 20)
        }
      } else {
        setIsGlassesPlaced(false)
        // Add debug info
        ctx.fillStyle = '#ff0000'
        ctx.font = '12px Arial'
        ctx.fillText('No face detected - position your face in camera', 10, 20)
      }
    } catch (err) {
      console.error('AR: Face detection error:', err)
      setIsGlassesPlaced(false)
    }
  }, [detector])

  // Animation loop for face detection
  useEffect(() => {
    console.log('AR: Animation loop effect - isCameraActive:', isCameraActive, 'detector:', !!detector)
    if (isCameraActive && detector) {
      console.log('AR: Starting face detection loop')
      const interval = setInterval(() => {
        try {
          detectFaceAndPlaceGlasses()
        } catch (err) {
          console.error('AR: Error in face detection loop:', err)
          // Don't stop the loop on individual errors, just continue
        }
      }, 100)
      return () => {
        console.log('AR: Stopping face detection loop')
        clearInterval(interval)
      }
    }
  }, [isCameraActive, detector, detectFaceAndPlaceGlasses])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (canvasRef.current && onCapture) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      onCapture(dataUrl)
    }
  }, [onCapture])

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading AR Try-On...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900">
          <div className="text-white text-center p-4 max-w-md">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-200 mb-4">{error}</p>
            <div className="space-y-2">
              {error.includes('denied') && (
                <div className="text-sm text-red-300">
                  <p>To fix this:</p>
                  <ol className="text-left mt-2 list-decimal list-inside">
                    <li>Click the camera icon 📷 in your browser's address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
              )}
              {error.includes('HTTPS') && (
                <div className="text-sm text-red-300">
                  <p>To fix this:</p>
                  <ol className="text-left mt-2 list-decimal list-inside">
                    <li>Use https://localhost:5173 instead of http://</li>
                    <li>Or deploy to a secure HTTPS server</li>
                  </ol>
                </div>
              )}
              <button 
                onClick={() => {
                  setError('')
                  checkCameraPermissions()
                }}
                className="px-4 py-2 bg-red-700 rounded hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ display: isCameraActive ? 'block' : 'none' }}
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: isCameraActive ? 'block' : 'none' }}
      />
      
      {!isCameraActive && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AR Glasses Try-On</h3>
            <p className="text-gray-400 mb-6">Use your camera to virtually try on glasses</p>
            
            {cameraPermission === 'denied' && (
              <div className="mb-4 p-3 bg-yellow-900 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⚠️ Camera access was denied. Please enable camera permissions in your browser settings.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                📷 Start Camera
              </button>
              
              <div className="text-xs text-gray-500">
                <p>Camera access is required for AR try-on</p>
                <p>Your camera feed is processed locally and never stored</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isCameraActive && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isGlassesPlaced ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-white text-sm">
              {isGlassesPlaced ? 'Glasses placed' : 'Position your face'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={capturePhoto}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARGlassesTryOn
