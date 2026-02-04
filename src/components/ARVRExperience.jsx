import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Model3DViewer from './Model3DViewer'
import ARGlassesTryOn from './ARGlassesTryOn'

// AR/VR Experience Component
function ARVRExperience({ 
  product, 
  className = '', 
  style = {},
  onCapture,
  onClose
}) {
  const [mode, setMode] = useState('3d') // '3d', 'ar', 'vr'
  const [isSupported, setIsSupported] = useState({
    ar: true,
    vr: false,
    camera: true
  })

  // Check device capabilities
  React.useEffect(() => {
    const checkCapabilities = async () => {
      // Check WebXR support (native browser API)
      let isVRSupported = false
      let isARSupported = false
      
      if ('xr' in navigator) {
        try {
          isVRSupported = await navigator.xr.isSessionSupported('immersive-vr')
          isARSupported = await navigator.xr.isSessionSupported('immersive-ar')
        } catch (error) {
          console.log('WebXR not available:', error)
        }
      }
      
      setIsSupported(prev => ({
        ...prev,
        vr: isVRSupported,
        ar: isARSupported
      }))

      // Check camera support
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      setIsSupported(prev => ({
        ...prev,
        camera: hasCamera
      }))
    }

    checkCapabilities()
  }, [])

  const handleModeChange = (newMode) => {
    if (newMode === 'ar' && !isSupported.camera) {
      alert('Camera access is required for AR try-on')
      return
    }
    if (newMode === 'vr' && !isSupported.vr) {
      alert('VR is not supported on this device')
      return
    }
    setMode(newMode)
  }

  const handleCapture = (imageData) => {
    if (onCapture) {
      onCapture(imageData)
    }
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`} style={style}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">AR/VR Experience</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="absolute top-20 left-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-1 flex">
          <button
            onClick={() => handleModeChange('3d')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              mode === '3d' 
                ? 'bg-blue-600 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <span>3D View</span>
            </span>
          </button>
          
          <button
            onClick={() => handleModeChange('ar')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              mode === 'ar' 
                ? 'bg-blue-600 text-white' 
                : 'text-white/70 hover:text-white'
            } ${!isSupported.camera ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>AR Try-On</span>
            </span>
          </button>
          
          <button
            onClick={() => handleModeChange('vr')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              mode === 'vr' 
                ? 'bg-blue-600 text-white' 
                : 'text-white/70 hover:text-white'
            } ${!isSupported.vr ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>VR Mode</span>
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full h-full pt-32">
        <AnimatePresence mode="wait">
          {mode === '3d' && (
            <motion.div
              key="3d"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full h-full"
            >
              <Model3DViewer
                modelUrl={product.model3d}
                scale={product.modelScale || 1}
                autoRotate={true}
                enableZoom={true}
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white text-sm text-center">
                  Drag to rotate • Scroll to zoom • Double-click to reset
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'ar' && (
            <motion.div
              key="ar"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full h-full"
            >
              <ARGlassesTryOn
                glassesModelUrl={product.model3d}
                onCapture={handleCapture}
                className="w-full h-full"
              />
            </motion.div>
          )}

          {mode === 'vr' && (
            <motion.div
              key="vr"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="text-center text-white">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">VR Mode</h3>
                <p className="text-gray-400 mb-4">
                  {isSupported.vr 
                    ? "VR mode requires a VR headset and WebXR support"
                    : "VR is not supported on this device"
                  }
                </p>
                <button
                  className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={!isSupported.vr}
                >
                  {isSupported.vr ? "Enter VR" : "Not Available"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="absolute bottom-20 left-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <h4 className="text-white font-semibold">{product.name}</h4>
          <p className="text-gray-300 text-sm">{product.description}</p>
          {product.features && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.features.map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ARVRExperience
