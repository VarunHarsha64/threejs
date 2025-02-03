import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/Addons.js";

const MapModel: React.FC = () => {
  const { scene } = useThree();
  const modelRef = useRef<THREE.Object3D | null>(null);
  const textureLoader = new THREE.TextureLoader();

  const textureCache: Record<string, THREE.Texture> = {};

  const texturePaths: Record<string, string> = {
    citybits: "/assets/textures/citybits_texture.png"
  };

  const axesHelper = new THREE.AxesHelper(5000);
  scene.add(axesHelper);

  useEffect(() => {
    const loader = new FBXLoader();

    // Load the FBX model
    loader.load(
      "/assets/models/superheromap.fbx",
      (object) => {
        object.scale.set(0.01, 0.01, 0.01);

        // Apply materials based on material names
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;

            if (Array.isArray(mesh.material)) {
              // Handle multiple materials per mesh
              mesh.material = mesh.material.map((mat) => applyMaterial(mat, textureLoader, textureCache, texturePaths) as THREE.Material);
            } else {
              // Handle single material
              mesh.material = applyMaterial(mesh.material, textureLoader, textureCache, texturePaths) as THREE.Material;
            }
          }
        });

        modelRef.current = object;
        scene.add(object);
      },
      (xhr) => console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`),
      (error) => console.error("Error loading FBX:", error)
    );

    return () => {
      if (modelRef.current) scene.remove(modelRef.current);
    };
  }, [scene]);

  return null;
};

const applyMaterial = (
  material: THREE.Material,
  textureLoader: THREE.TextureLoader,
  textureCache: Record<string, THREE.Texture>,
  texturePaths: Record<string, string>
) => {
  // Always apply citybits texture
  const citybitsTexturePath = texturePaths.citybits;

  // Load texture only once to optimize performance
  if (!textureCache.citybits) {
    textureCache.citybits = textureLoader.load(citybitsTexturePath);
    textureCache.citybits.flipY = true; // Prevents upside-down textures
  }

  // Create and return a new material with citybits texture
  return new THREE.MeshStandardMaterial({
    map: textureCache.citybits,
    metalness: 0.3,
    roughness: 0.7,
  });
};

export default MapModel;
