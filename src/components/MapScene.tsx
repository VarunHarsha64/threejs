import { Canvas } from "@react-three/fiber";
import CameraComponent from "./CameraComponent";
import MapModel from "./MapModel";
import * as THREE from 'three'
import OrbitControlsComponent from "./OrbitControlsComponent";


const MapScene: React.FC = () => {
  return (
    <div className="h-screen w-full">
      <Canvas>
        <CameraComponent position={[0, 60, 0]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <MapModel />
        <OrbitControlsComponent
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={-Math.PI / 4}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={5 * Math.PI / 12}
          target={new THREE.Vector3(0, 0, 0)}        />
      </Canvas>
    </div>
  );
};

export default MapScene;