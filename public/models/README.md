# 3D Models Directory

This directory contains 3D models for AR/VR functionality.

## Supported Formats
- `.glb` - Binary GLTF (recommended)
- `.gltf` - GLTF with separate binary file
- `.obj` - Wavefront OBJ

## Model Requirements
- Keep models under 10MB for optimal performance
- Use PBR materials for realistic rendering
- Include proper UV mapping
- Optimize polygon count (under 50k polygons recommended)

## Glasses Models Structure
- `aviator-glasses.glb` - Classic aviator sunglasses
- `wayfarer-glasses.glb` - Wayfarer style glasses
- `round-glasses.glb` - Round vintage glasses
- `sport-sunglasses.glb` - Sport wrap sunglasses
- `smart-ar-glasses.glb` - Smart AR glasses

## Accessory Models
- `classic-watch.glb` - Classic analog watch

## Usage
Models are automatically loaded by the ARVRExperience component based on the `model3d` property in product data.

## Tips
- Use Blender or similar software to create models
- Test models in the 3D viewer before deployment
- Include multiple LODs (Level of Detail) for better performance
