import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// Mocked VehicleScene
import VehicleScene from '../pages/VehicleScene.jsx';

const stickers = [
  '/stickers/sticker1.png',
  '/stickers/sticker2.png',
  '/stickers/sticker3.png',
];

export default function StickerChecker() {
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [matchResult, setMatchResult] = useState('');

  // Mock comparison function — replace with your actual logic
  const checkStickerMatch = (stickerPath) => {
    // Example: Assume sticker2.png is present on one of the vehicles
    return stickerPath.includes('sticker2');
  };

  const handleStickerClick = (stickerPath) => {
    setSelectedSticker(stickerPath);
    const isMatch = checkStickerMatch(stickerPath);
    setMatchResult(isMatch ? 'Match Found ✅' : 'No Match ❌');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 3D Viewer */}
      <div className="w-full h-[400px] bg-white rounded-md shadow-md mb-6">
        <Canvas camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <VehicleScene selectedSticker={selectedSticker} />
          <OrbitControls />
        </Canvas>
      </div>

      {/* Sticker List */}
      <div className="flex-shrink-0 w-full bg-white p-4 rounded-lg shadow-lg flex justify-start gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {stickers.map((stickerPath, index) => (
          <button
            key={index}
            onClick={() => handleStickerClick(stickerPath)}
            className={`w-24 h-24 border-2 ${
              selectedSticker === stickerPath ? 'border-green-500' : 'border-gray-300'
            } rounded-md overflow-hidden transition-all hover:scale-105`}
          >
            <img
              src={stickerPath}
              alt={`Sticker ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Match Result */}
      {selectedSticker && (
        <div className="mt-4 text-center text-lg font-medium text-gray-800">
          {matchResult}
        </div>
      )}
    </div>
  );
}