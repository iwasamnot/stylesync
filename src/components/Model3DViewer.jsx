import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// WebGL context handler component
function WebGLContextHandler({ onContextLost, onContextRestored }) {
  const { gl } = useThree()
  
  React.useEffect(() => {
    // Handle WebGL context loss
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost, attempting recovery...');
      if (onContextLost) onContextLost();
    };
    
    const handleContextRestored = () => {
      console.log('WebGL context restored');
      if (onContextRestored) onContextRestored();
    };
    
    const canvas = gl.domElement;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, [gl, onContextLost, onContextRestored]);
  
  return null;
}

// Simple Error Boundary component for 3D objects
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Model Error Boundary caught an error:', error, errorInfo)
    // Don't crash the app, just show fallback
  }

  render() {
    if (this.state.hasError) {
      console.log('Error boundary triggered, showing fallback model')
      // Return fallback 3D object, not HTML
      return <FallbackModel scale={1} position={[0, 0, 0]} shape="glasses" />
    }

    return this.props.children
  }
}

// Model component for loading 3D models
function Model({ url, scale = 1, position = [0, 0, 0] }) {
  const mesh = useRef()
  
  // Use Suspense to handle loading properly
  const gltf = useGLTF(url)
  
  console.log('Model component - gltf:', gltf)
  console.log('Model component - url:', url)
  
  // Auto-center and scale the model
  React.useEffect(() => {
    if (gltf?.scene) {
      // Center the model
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      // Move model to center
      gltf.scene.position.x = -center.x
      gltf.scene.position.y = -center.y
      gltf.scene.position.z = -center.z
      
      // Auto-scale if too large or too small
      const maxDim = Math.max(size.x, size.y, size.z)
      const desiredSize = 1.5 // Smaller target size
      const autoScale = desiredSize / maxDim
      
      console.log('Model size:', size)
      console.log('Auto scale:', autoScale)
      
      // Apply scale with limits
      const finalScale = Math.min(Math.max(autoScale * scale, 0.1), 3) // Limit scale between 0.1 and 3
      gltf.scene.scale.setScalar(finalScale)
      
      // Position model at origin after scaling
      gltf.scene.position.set(0, 0, 0)
    }
  }, [gltf, scale])
  
  useFrame((state, delta) => {
    if (mesh.current && gltf?.scene) {
      mesh.current.rotation.y += delta * 0.5
    }
  })

  if (!gltf?.scene) {
    console.log('Model not loaded yet, returning null')
    return null // Let Suspense handle loading
  }

  console.log('Model loaded successfully, rendering scene')
  return (
    <primitive 
      ref={mesh}
      object={gltf.scene} 
      position={position}
    />
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4A90E2" />
    </mesh>
  )
}

// Fallback component for when 3D model is not available
function FallbackModel({ color = '#333333', scale = 1, position = [0, 0, 0], shape = 'box' }) {
  const mesh = useRef()
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5
    }
  })

  // Render different shapes based on product type
  const renderShape = () => {
    switch (shape) {
      case 'glasses':
        return (
          <group ref={mesh} scale={scale} position={position}>
            // Left lens
            <mesh position={[-0.3, 0, 0]}>
              <boxGeometry args={[0.25, 0.1, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            // Right lens
            <mesh position={[0.3, 0, 0]}>
              <boxGeometry args={[0.25, 0.1, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            // Bridge
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.05, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            // Left temple
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            // Right temple
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )
      case 'watch':
        return (
          <group ref={mesh} scale={scale} position={position}>
            // Watch face
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
            // Watch band
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.5, 0.4, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh ref={mesh} scale={scale} position={position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
    }
  }

  return <>{renderShape()}</>
}

// Main 3D Model Viewer Component
function Model3DViewer({ 
  modelUrl, 
  fallbackColor = '#333333',
  scale = 1,
  autoRotate = true,
  enableZoom = true,
  enablePan = true,
  className = '',
  style = {}
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [modelStatus, setModelStatus] = useState('loading')
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  console.log('Model3DViewer - modelUrl:', modelUrl)
  console.log('Model3DViewer - modelStatus:', modelStatus)

  const handleLoad = () => {
    console.log('Model3DViewer - handleLoad called')
    setIsLoading(false)
    setError(false)
    setUseFallback(false)
    setModelStatus('loaded')
  }

  const handleError = (err) => {
    console.error('Model3DViewer - handleError:', err)
    setIsLoading(false)
    setError(true)
    setUseFallback(true)
    setModelStatus('error')
  }

  // Check if modelUrl is a placeholder file
  const isPlaceholder = modelUrl && (
    !modelUrl.endsWith('.glb') && !modelUrl.endsWith('.gltf')
  )

  console.log('Model3DViewer - isPlaceholder:', isPlaceholder)

  // Test if model URL is accessible
  React.useEffect(() => {
    if (modelUrl && !isPlaceholder) {
      console.log('Model3DViewer - checking model URL accessibility')
      fetch(modelUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            console.warn('Model file not accessible:', modelUrl, response.status)
            setModelStatus('not-found')
            setError(true)
          } else {
            console.log('Model file accessible:', modelUrl)
            setModelStatus('accessible')
            setIsLoading(false)
          }
        })
        .catch(err => {
          console.warn('Model file check failed:', err)
          setModelStatus('check-failed')
        })
    }
  }, [modelUrl, isPlaceholder])

  // Add timeout for loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && modelStatus === 'accessible') {
        setLoadingTimeout(true)
        setError(true)
        setModelStatus('timeout')
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timer)
  }, [isLoading, modelStatus])

  // Handle WebGL context loss
  const handleContextLost = React.useCallback(() => {
    console.log('WebGL context lost detected')
    setError(true)
    setModelStatus('context-lost')
  }, [])

  // Handle WebGL context restore
  const handleContextRestored = React.useCallback(() => {
    console.log('WebGL context restored')
    setError(false)
    setModelStatus('accessible')
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-sm text-gray-600">Loading 3D Model...</div>
          </div>
        </div>
      )}
      
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
        camera={{ position: [0, 0, 3], fov: 60 }}
      >
        <WebGLContextHandler 
          onContextLost={handleContextLost}
          onContextRestored={handleContextRestored}
        />
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={60} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="studio" />
        
        <Suspense fallback={<LoadingFallback />}>
          {modelUrl && !error && !isPlaceholder ? (
            <ErrorBoundary>
              <Model 
                url={modelUrl} 
                scale={scale}
              />
            </ErrorBoundary>
          ) : (
            <FallbackModel 
              color={fallbackColor} 
              scale={scale}
              position={[0, 0, 0]}
              // Different shapes for different products
              shape={
                modelUrl?.includes('glasses') ? 'glasses' :
                modelUrl?.includes('watch') ? 'watch' :
                'box'
              }
            />
          )}
        </Suspense>
        
        <OrbitControls 
          enableZoom={enableZoom}
          enablePan={enablePan}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={8}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {modelStatus === 'context-lost' && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm z-20">
          WebGL context lost - try refreshing the page
        </div>
      )}
      
      {modelStatus === 'context-lost' && (
        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm z-20">
          WebGL context lost - 
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:no-underline"
          >
            Refresh Page
          </button>
        </div>
      )}
      
      {modelStatus === 'loaded' && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm z-20">
          ✅ Real 3D Model Loaded
        </div>
      )}
      
      {modelStatus === 'accessible' && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm z-20">
          📁 Loading Real 3D Model...
        </div>
      )}
      
      {modelStatus === 'timeout' && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded text-sm z-20">
          ⏱️ Loading Timeout (10s)
        </div>
      )}
      
      {modelStatus === 'not-found' && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm z-20">
          ❌ Model File Not Found
        </div>
      )}
      
      {modelStatus === 'check-failed' && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm z-20">
          ⚠️ Model Check Failed
        </div>
      )}
      
      {error && (
        <div className="absolute bottom-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm z-20">
          Using placeholder 3D model
        </div>
      )}
      
      {!error && modelStatus === 'accessible' && (
        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm z-20">
          Loading your real aviator glasses model...
        </div>
      )}
      
      {loadingTimeout && (
        <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-sm z-20">
          Model loading took too long - using placeholder
        </div>
      )}
      
      {modelStatus === 'context-lost' && (
        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm z-20">
          WebGL context lost - try refreshing the page
        </div>
      )}
    </div>
  )
}

export default Model3DViewer
