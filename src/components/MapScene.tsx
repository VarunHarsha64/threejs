import { Canvas } from "@react-three/fiber";
import CameraComponent from "./CameraComponent";
import MapModel from "./MapModel";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

const MapScene: React.FC = () => {
  const controlsRef = useRef<any>(null); // Ref for OrbitControls

  // Function to update camera's z position based on polar angle
  const updateCameraZPosition = () => {
    console.log("shgdfhgs")
    if (controlsRef.current) {
      const polarAngle = controlsRef.current.getPolarAngle();
      console.log(polarAngle)
      // Adjust zoom level (camera position along z-axis) based on polar angle
      const zoomFactor = Math.abs(Math.cos(polarAngle)); // Zoom in/out based on polar angle
      controlsRef.current.object.position.z = 10 * zoomFactor; // Adjust the zoom range here
    }
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.addEventListener("change", updateCameraZPosition);
    }

    return () => {
      if (controlsRef.current) {
        controlsRef.current.removeEventListener("change", updateCameraZPosition);
      }
    };
  }, []);

  return (
    <div className="h-screen w-full">
      <Canvas>
        <CameraComponent position={[0, 0, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <MapModel />
        <OrbitControls
          ref={controlsRef}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={-Math.PI / 4}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={5 * Math.PI / 12}
        />
      </Canvas>
    </div>
  );
};

export default MapScene;
