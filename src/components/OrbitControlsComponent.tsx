import { OrbitControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { FC, useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface OrbitControlsProps {
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    target: THREE.Vector3;}

const OrbitControlsComponent: FC<OrbitControlsProps> = ({
    minAzimuthAngle,
    maxAzimuthAngle,
    minPolarAngle,
    maxPolarAngle,
    target,
}) => {
    const controlsRef = useRef<any>(null);
    const { camera, gl } = useThree();
    const [targetPolarAngle, setTargetPolarAngle] = useState(minPolarAngle);
    // const touchStartRef = useRef<{ y: number; angle: number } | null>(null);
    const isDragging = useRef(false);
    const isWheelActive = useRef(false);
    const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
    const currentTargetRef = useRef(new THREE.Vector3());
    const initialYPosition = useRef(camera.position.y);
    const initialTargetYPosition = useRef(controlsRef.current?.target.y);

    const smoothingFactor = 2;
    // const touchSensitivity = 0.05;
    const panSensitivity = 0.05;

    useFrame(() => {
        // console.log(camera.position.x - controlsRef.current.target.x, camera.position.z - controlsRef.current.target.z);

        if (!controlsRef.current) return;

        if (isWheelActive.current) {
            const currentPolarAngle = controlsRef.current.getPolarAngle();
            const newPolarAngle = currentPolarAngle + (targetPolarAngle - currentPolarAngle) * smoothingFactor;
            controlsRef.current.setPolarAngle(newPolarAngle);
        }

        if (isWheelActive.current && !isDragging.current) {
            const polarAngle = controlsRef.current.getPolarAngle();
            const idealZoom = 8 * Math.abs(Math.cos(polarAngle)) + 5;
            camera.position.y += (idealZoom - camera.position.y) * smoothingFactor;
            console.log(idealZoom, camera.position.y);
        }

        camera.updateProjectionMatrix();
    });

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            isDragging.current = true;
            // Ensure wheel processing stops when dragging starts
            isWheelActive.current = false;
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
            lastMousePosition.current = { x: event.clientX, y: event.clientY };
            initialYPosition.current = camera.position.y;
            initialTargetYPosition.current = controlsRef.current.target.y;
            gl.domElement.style.cursor = 'grabbing';
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging.current || !lastMousePosition.current) return;
        
            // Calculate movement delta (in pixels)
            const deltaX = (event.clientX - lastMousePosition.current.x) * panSensitivity;
            const deltaY = (event.clientY - lastMousePosition.current.y) * panSensitivity;
        
            // Get the camera's right and forward vectors
            const right = new THREE.Vector3();
            const forward = new THREE.Vector3();
            
            camera.getWorldDirection(forward); // Forward direction
            forward.y = 0; // Ignore vertical movement
            forward.normalize();
        
            right.crossVectors(camera.up, forward).normalize(); // Right direction
        
            // Adjust camera and target positions
            camera.position.addScaledVector(right, deltaX);
            camera.position.addScaledVector(forward, deltaY);
        
            controlsRef.current.target.addScaledVector(right, deltaX);
            controlsRef.current.target.addScaledVector(forward, deltaY);
        
            // Keep the camera's Y position fixed
            camera.position.y = initialYPosition.current;
            controlsRef.current.target.y = initialTargetYPosition.current;
        
            lastMousePosition.current = { x: event.clientX, y: event.clientY };
        };
        

        const handleMouseUp = () => {
            isDragging.current = false;
            lastMousePosition.current = null;
            gl.domElement.style.cursor = 'grab';
        };

        const handleWheel = (event: WheelEvent) => {
            if (!isDragging.current) {
                event.preventDefault();
                if (wheelTimeoutRef.current) {
                    clearTimeout(wheelTimeoutRef.current);
                }
                const currentPolarAngle = controlsRef.current.getPolarAngle();
                const newPolarAngle = currentPolarAngle + event.deltaY * 0.005;
                const clampedPolarAngle = Math.max(minPolarAngle, Math.min(maxPolarAngle, newPolarAngle));
                setTargetPolarAngle(clampedPolarAngle);
                isWheelActive.current = true;

                wheelTimeoutRef.current = setTimeout(() => {
                    isWheelActive.current = false;
                }, 1000);
            }
        };

        const canvas = gl.domElement;
        canvas.style.cursor = 'grab';

        canvas.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("wheel", handleWheel, { passive: false });
        // canvas.addEventListener("touchstart", handleTouchStart);
        // canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        // canvas.addEventListener("touchend", handleTouchEnd);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("wheel", handleWheel);
            // canvas.removeEventListener("touchstart", handleTouchStart);
            // canvas.removeEventListener("touchmove", handleTouchMove);
            // canvas.removeEventListener("touchend", handleTouchEnd);

            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
        };
    }, [camera, gl.domElement, minPolarAngle, maxPolarAngle]);

    // Call this function to move the camera to a specific target position
    // const updateCameraPosition = (targetX: number, targetZ: number) => {
    //     const targetPosition = new THREE.Vector3(targetX, controlsRef.current.target.y, targetZ);
    //     controlsRef.current.target.copy(targetPosition);
    //     camera.position.set(targetX, camera.position.y, targetZ);
    //     camera.lookAt(targetPosition);
    // };

    // // Triggered when the parent component calls this function
    // useEffect(() => {
    //     moveCameraToTarget && moveCameraToTarget(10, 10); // Example move
    // }, [moveCameraToTarget]);

    return (
        <OrbitControls
            ref={controlsRef}
            target={target}
            enableZoom={false}
            enableRotate={false}
            enablePan={false}
            screenSpacePanning={false}
            minAzimuthAngle={minAzimuthAngle}
            maxAzimuthAngle={maxAzimuthAngle}
            minPolarAngle={minPolarAngle}
            maxPolarAngle={maxPolarAngle}
        />
    );
};

export default OrbitControlsComponent;