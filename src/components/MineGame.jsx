import React, { useState, useEffect } from 'react';

const MinesGame = () => {
  const [size, setSize] = useState(5);
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [mines, setMines] = useState(3);
  const [gems, setGems] = useState(22);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [potentialWin, setPotentialWin] = useState(0);
  const [balance, setBalance] = useState(1000);

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
    setGems(size * size - mines);
    setCurrentMultiplier(1);
    setPotentialWin(0);
  };

  const calculateMultiplier = (clickCount) => {
    const totalTiles = size * size;
    const safeTiles = totalTiles - mines;
    const probability = (safeTiles - clickCount) / (totalTiles - clickCount);
    const houseEdge = 0.98;
    return (houseEdge / probability) * (1 + clickCount * 0.1);
  };

  const handleTileClick = (x, y) => {
    if (!gameStarted || revealed[y][x]) return;
    const newRevealed = [...revealed];
    newRevealed[y][x] = true;
    setRevealed(newRevealed);

    if (board[y][x]) {
      handleLoss();
    } else {
      const revealedCount = newRevealed.flat().filter(Boolean).length;
      const newMultiplier = calculateMultiplier(revealedCount);
      setCurrentMultiplier(newMultiplier);
      setPotentialWin(betAmount * newMultiplier);
    }
  };

  const handleLoss = () => {
    setGameStarted(false);
    setBalance(prevBalance => prevBalance - betAmount);
  };

  const handleBetCashout = () => {
    if (!gameStarted) {
      if (betAmount > 0 && betAmount <= balance) {
        initializeGame();
        setGameStarted(true);
        setBalance(prevBalance => prevBalance - betAmount);
      }
    } else {
      setBalance(prevBalance => prevBalance + potentialWin);
      setGameStarted(false);
    }
  };

  const pickRandomTile = () => {
    const unrevealedTiles = [];
    revealed.forEach((row, y) => {
      row.forEach((isRevealed, x) => {
        if (!isRevealed) unrevealedTiles.push([x, y]);
      });
    });
    if (unrevealedTiles.length > 0) {
      const [x, y] = unrevealedTiles[Math.floor(Math.random() * unrevealedTiles.length)];
      handleTileClick(x, y);
    }
  };

  const renderBoard = () => {
    return board.map((row, y) => (
      <div key={y} className="flex">
        {row.map((isMine, x) => (
          <button
            key={`${x}-${y}`}
            className={`w-20 h-20 m-1 rounded-md flex items-center justify-center ${
              revealed[y][x]
                ? isMine
                  ? 'bg-red-500'
                  : 'bg-green-500'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => handleTileClick(x, y)}
            disabled={!gameStarted}
          >
            {revealed[y][x] && !isMine && (
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4CAF50" stroke="#45A045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="flex bg-gray-900 text-white p-8 rounded-lg h-screen">
      <div className="w-1/3 pr-8 flex flex-col">
        <div className="mb-4 flex justify-between">
          <button className="bg-gray-700 px-4 py-2 rounded">Manual</button>
          <button className="bg-gray-800 px-4 py-2 rounded" disabled>Auto</button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Balance</label>
          <div className="bg-gray-800 text-white p-2 rounded w-full">
            ${balance.toFixed(2)}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Bet Amount: ${betAmount.toFixed(2)}</label>
          <div className="flex items-center">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded-l w-full"
            />
            <button className="bg-gray-700 p-2 rounded-r" onClick={() => setBetAmount(prevBet => prevBet / 2)}>½</button>
            <button className="bg-gray-700 p-2 rounded-r ml-1" onClick={() => setBetAmount(prevBet => prevBet * 2)}>2x</button>
          </div>
        </div>
        <div className="mb-4 flex justify-between">
          <div>
            <label className="block mb-2">Mines</label>
            <input
              type="number"
              value={mines}
              onChange={(e) => setMines(Number(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded w-full"
              min="1"
              max="24"
            />
          </div>
          <div>
            <label className="block mb-2">Gems</label>
            <input
              type="number"
              value={gems}
              className="bg-gray-800 text-white p-2 rounded w-full"
              disabled
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Total profit ({currentMultiplier.toFixed(2)}x)</label>
          <input
            type="text"
            value={`$${potentialWin.toFixed(2)}`}
            className="bg-gray-800 text-white p-2 rounded w-full"
            disabled
          />
        </div>
        <button
          onClick={pickRandomTile}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
          disabled={!gameStarted}
        >
          Pick random tile
        </button>
        <button
          onClick={handleBetCashout}
          className={`w-full ${gameStarted ? 'bg-green-500' : 'bg-blue-500'} text-white p-2 rounded mb-4`}
        >
          {gameStarted ? 'Cashout' : 'Bet'}
        </button>
      </div>
      <div className="w-2/3 flex items-center justify-center">
        <div className="flex flex-col items-center">
          {renderBoard()}
        </div>
      </div>
    </div>
  );
};

export default MinesGame;