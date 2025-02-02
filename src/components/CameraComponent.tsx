import { PerspectiveCamera } from "@react-three/drei";
import { FC } from "react";

interface CameraProps {
  position?: [number, number, number];
}

const CameraComponent: FC<CameraProps> = ({ position }) => {
  return <PerspectiveCamera makeDefault position={position} />;
};

export default CameraComponent;
