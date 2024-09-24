"use client"
import React, { useState, useEffect } from 'react';

const MinesGame = () => {
  const [size, setSize] = useState(5);
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [mines, setMines] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [blastCoords, setBlastCoords] = useState(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [potentialWin, setPotentialWin] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [size, mines]);

  const initializeGame = () => {
    const newBoard = Array(size).fill().map(() => Array(size).fill(false));
    let placedMines = 0;
    while (placedMines < mines) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!newBoard[y][x]) {
        newBoard[y][x] = true;
        placedMines++;
      }
    }

    setBoard(newBoard);
    setRevealed(Array(size).fill().map(() => Array(size).fill(false)));
    setGameOver(false);
    setWin(false);
    setGameStarted(false);
    setBlastCoords(null);
    setCurrentMultiplier(1);
    setPotentialWin(0);
  };

  const calculateMultiplier = (clickCount) => {
    const totalTiles = size * size;
    const safeTiles = totalTiles - mines;
    const probability = (safeTiles - clickCount) / (totalTiles - clickCount);
    
    // Apply a house edge (e.g., 5%)
    const houseEdge = 0.95;
    
    return houseEdge / probability;
  };

  const handleTileClick = (x, y) => {
    if (gameOver || win || revealed[y][x] || !gameStarted) return;

    const newRevealed = [...revealed];
    newRevealed[y][x] = true;
    setRevealed(newRevealed);

    if (board[y][x]) {
      setGameOver(true);
      setBlastCoords({ x, y });
      revealAllMines();
    } else {
      const revealedCount = newRevealed.flat().filter(Boolean).length;
      const newMultiplier = calculateMultiplier(revealedCount);
      setCurrentMultiplier(newMultiplier);
      setPotentialWin(betAmount * newMultiplier);

      if (revealedCount === size * size - mines) {
        setWin(true);
      }
    }
  };

  const revealAllMines = () => {
    const allRevealed = board.map((row, y) =>
      row.map((isMine, x) => isMine || revealed[y][x])
    );
    setRevealed(allRevealed);
  };

  const renderBoard = () => {
    return board.map((row, y) => (
      <div key={y} className="flex">
        {row.map((isMine, x) => (
          <button
            key={`${x}-${y}`}
            className={`w-12 h-12 m-1 rounded-md relative ${
              revealed[y][x]
                ? isMine
                  ? 'bg-red-500'
                  : 'bg-green-500'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => handleTileClick(x, y)}
          >
            {blastCoords && blastCoords.x === x && blastCoords.y === y && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            )}
            {revealed[y][x] && isMine && '💣'}
          </button>
        ))}
      </div>
    ));
  };

  const handleBet = () => {
    if (betAmount > 0) {
      setGameStarted(true);
      setPotentialWin(betAmount);
    }
  };

  const handleRestart = () => {
    initializeGame();
    setBetAmount(0);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-8 rounded-lg">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-4">
          <button className="bg-gray-700 px-4 py-2 rounded">Manual</button>
          <button className="bg-gray-800 px-4 py-2 rounded" disabled>Auto</button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Bet Amount</label>
          <div className="flex items-center">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded-l w-full"
            />
            <button className="bg-gray-700 p-2 rounded-r">½</button>
            <button className="bg-gray-700 p-2 rounded-r ml-1">2x</button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Mines</label>
          <select
            value={mines}
            onChange={(e) => setMines(Number(e.target.value))}
            className="bg-gray-800 text-white p-2 rounded w-full"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleBet}
          className="w-full bg-green-500 text-white p-2 rounded mb-4"
          disabled={gameStarted}
        >
          Bet
        </button>
      </div>
      <div className="mt-4 mb-4">
        <p>Current Multiplier: {currentMultiplier.toFixed(2)}x</p>
        <p>Potential Win: {potentialWin.toFixed(2)}</p>
      </div>
      <div className="mt-4">{renderBoard()}</div>
      {(gameOver || win) && (
        <div className="mt-4 text-xl font-bold">
          {win ? `You won ${potentialWin.toFixed(2)}!` : 'Game over!'}
          <button
            onClick={handleRestart}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MinesGame;