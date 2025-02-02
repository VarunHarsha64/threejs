import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export const CustomPan = () => {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      isDragging.current = true;
      lastPosition.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging.current) return;

      const deltaX = (event.clientX - lastPosition.current.x) * 0.01;
      const deltaY = (event.clientY - lastPosition.current.y) * 0.01;

      camera.position.x -= deltaX; // Move left/right
      camera.position.y += deltaY; // Move up/down

      lastPosition.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [camera]);

  return null;
};
