# AR/VR Features Documentation

## Overview
StyleSync now includes advanced AR/VR functionality for accessories, allowing customers to virtually try on glasses and other products using their device camera.

## Features Added

### 1. 3D Model Viewer
- **Component**: `Model3DViewer.jsx`
- **Technology**: Three.js, React Three Fiber
- **Features**:
  - Interactive 3D model rotation
  - Zoom and pan controls
  - Auto-rotation
  - Fallback for missing models
  - Support for GLB, GLTF, and OBJ formats

### 2. AR Glasses Try-On
- **Component**: `ARGlassesTryOn.jsx`
- **Technology**: TensorFlow.js, Face Landmarks Detection
- **Features**:
  - Real-time face detection
  - Automatic glasses placement
  - Camera capture functionality
  - Face landmark tracking
  - Photo saving capability

### 3. AR/VR Experience Hub
- **Component**: `ARVRExperience.jsx`
- **Features**:
  - Mode switching (3D View, AR Try-On, VR Mode)
  - Device capability detection
  - Responsive design
  - Product information display
  - Capture and download functionality

## Product Data Structure

Products with AR support include these additional properties:

```javascript
{
  // ... existing product properties
  arEnabled: true,           // Enable AR features
  model3d: "/models/glasses.glb",  // Path to 3D model
  modelScale: 0.8,          // Scale factor for 3D model
  arType: "glasses",        // Type of AR (glasses, watch, etc.)
  features: ["Polarized", "UV Protection"], // Product features
  subcategory: "Sunglasses" // Product subcategory
}
```

## Installation

### New Dependencies Added
```json
{
  "@tensorflow-models/face-landmarks-detection": "^1.0.5",
  "@tensorflow/tfjs": "^4.17.0",
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.12",
  "@react-three/drei": "^9.92.7",
  "webxr-api": "^0.5.0"
}
```

### Install Dependencies
```bash
npm install
```

## Usage

### For Customers
1. Navigate to any accessory product with AR support
2. Click the "Try AR/VR" button
3. Choose between:
   - **3D View**: Interactive 3D model examination
   - **AR Try-On**: Virtual try-on using camera
   - **VR Mode**: VR headset experience (when supported)

### For Developers

#### Adding AR to New Products
1. Create or obtain a 3D model (GLB format recommended)
2. Place model in `/public/models/` directory
3. Update product data with AR properties
4. Set `arEnabled: true`

#### Creating 3D Models
- Use Blender, 3ds Max, or similar software
- Optimize for web (under 10MB)
- Use PBR materials for realism
- Include proper UV mapping
- Export as GLB for best performance

## Technical Implementation

### Face Detection
- Uses MediaPipe Face Mesh model
- Detects 468 facial landmarks
- Real-time processing at 10 FPS
- Automatic glasses placement based on eye position

### 3D Rendering
- Three.js for WebGL rendering
- React Three Fiber for React integration
- PBR material support
- Lighting and environment mapping

### Device Support
- **Desktop**: Full 3D viewer support
- **Mobile**: AR try-on with camera
- **VR**: WebXR API support (limited devices)
- **Fallback**: Graceful degradation for unsupported features

## Performance Considerations

### Optimization Tips
1. **Model Size**: Keep 3D models under 10MB
2. **Polygon Count**: Aim for under 50k polygons
3. **Texture Resolution**: Use 1024x1024 or smaller
4. **LOD**: Include multiple detail levels if possible

### Caching Strategy
- 3D models cached for 30 days
- Images cached separately
- TensorFlow models loaded once per session

## Browser Support

### Required Features
- WebGL 2.0 (for 3D rendering)
- WebRTC (for camera access)
- WebXR API (for VR mode, optional)
- ES6+ JavaScript support

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security & Privacy

### Camera Access
- Camera only accessed with explicit user permission
- No camera data stored or transmitted
- Real-time processing only, no recording

### Face Data
- Face landmarks processed locally
- No biometric data stored
- Immediate processing, no persistence

## Troubleshooting

### Common Issues

#### Camera Not Working
- Check browser permissions
- Ensure HTTPS connection
- Try refreshing the page

#### 3D Model Not Loading
- Verify model file exists
- Check file format (GLB recommended)
- Monitor console for errors

#### Performance Issues
- Close other browser tabs
- Check device capabilities
- Reduce model complexity

### Debug Mode
Enable debug mode in browser console:
```javascript
localStorage.setItem('ar-debug', 'true');
```

## Future Enhancements

### Planned Features
- [ ] More AR accessory types (watches, jewelry)
- [ ] Advanced face tracking
- [ ] Multi-product try-on
- [ ] Social sharing of AR photos
- [ ] Size recommendation based on face measurements

### Technical Improvements
- [ ] WebGPU support
- [ ] Machine learning model optimization
- [ ] Progressive loading for large models
- [ ] Offline AR mode

## Support

For technical support or feature requests:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Test on different devices/browsers
4. Contact development team with specific issues

---

**Note**: AR features require HTTPS and modern browsers for optimal performance.
