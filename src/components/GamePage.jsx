"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import MinesGame from './MineGame'; // Make sure this path is correct

const GamesPage = () => {
  const [showMinesGame, setShowMinesGame] = useState(false);

  return (
    <div className="bg-gradient-to-b from-purple-900 to-purple-700 min-h-screen text-white p-8">
      <h1 className="text-6xl font-bold text-center mb-12">Games</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image src="/images/mines-game.png" alt="Mines Game" width={400} height={300} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Mines</h2>
            <p className="text-gray-300 mb-4">Play the exciting Mines game and test your luck!</p>
            <button 
              onClick={() => setShowMinesGame(!showMinesGame)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              {showMinesGame ? 'Hide Game' : 'Play Now'}
            </button>
          </div>
        </div>
      </div>

      {showMinesGame && (
        <div className="mt-12">
          <MinesGame />
        </div>
      )}
    </div>
  );
};

export default GamesPage;