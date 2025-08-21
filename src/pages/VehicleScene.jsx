import React from 'react';
import { useTexture } from '@react-three/drei';

export default function VehicleScene({ selectedSticker }) {
  const vehicleTexture = useTexture(selectedSticker || '/default.png');

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial map={vehicleTexture} />
    </mesh>
  );
}