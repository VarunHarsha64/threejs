import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/Addons.js";

const modelPaths = [
  "/assets/models/MapModelSuperhero/ground.fbx",
  "/assets/models/MapModelSuperhero/Grass.fbx",
  "/assets/models/MapModelSuperhero/Trees.fbx",
  "/assets/models/MapModelSuperhero/roads.fbx",
  "/assets/models/MapModelSuperhero/rocks.fbx",
  "/assets/models/MapModelSuperhero/buildings1.fbx",
  "/assets/models/MapModelSuperhero/buildings2.fbx",
  "/assets/models/MapModelSuperhero/forest.fbx",
];

const MapModel: React.FC = () => {
  const { scene } = useThree();
  const modelRefs = useRef<THREE.Object3D[]>([]);
  const textureLoader = new THREE.TextureLoader();

  const textureCache: Record<string, THREE.Texture> = {};

  const texturePath = "/assets/textures/A.png"; // Change to A.png

  const axesHelper = new THREE.AxesHelper(5000);
  scene.add(axesHelper);

  useEffect(() => {
    const loader = new FBXLoader();

    if (!textureCache.A) {
      textureCache.A = textureLoader.load(texturePath);
      textureCache.A.flipY = true; // Correct texture orientation
    }

    modelPaths.forEach((path) => {
      loader.load(
        path,
        (object) => {
          object.scale.set(0.01, 0.01, 0.01);

          object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = new THREE.MeshStandardMaterial({
                map: textureCache.A,
                metalness: 0.3,
                roughness: 0.7,
              });
            }
          });

          modelRefs.current.push(object);
          scene.add(object);
        },
        (xhr) => console.log(`Loading ${path}: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`),
        (error) => console.error(`Error loading ${path}:`, error)
      );
    });

    return () => {
      modelRefs.current.forEach((model) => scene.remove(model));
      modelRefs.current = [];
    };
  }, [scene]);

  return null;
};

export default MapModel;
