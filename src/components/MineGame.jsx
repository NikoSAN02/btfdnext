import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABI and contract address would be imported from separate files in a real project
// Correct ABI from the provided JSON
const contractABI = [
  {
     "inputs":[],
     "stateMutability":"nonpayable",
     "type":"constructor"
  },
  {
     "inputs":[{"internalType":"address","name":"owner","type":"address"}],
     "name":"OwnableInvalidOwner",
     "type":"error"
  },
  {
     "inputs":[{"internalType":"address","name":"account","type":"address"}],
     "name":"OwnableUnauthorizedAccount",
     "type":"error"
  },
  {
     "anonymous":false,
     "inputs":[
        {"indexed":true,"internalType":"address","name":"player","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"winAmount","type":"uint256"},
        {"indexed":false,"internalType":"bytes32","name":"gameStateHash","type":"bytes32"}
     ],
     "name":"GameEnded",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {"indexed":true,"internalType":"address","name":"player","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"betAmount","type":"uint256"},
        {"indexed":false,"internalType":"uint256","name":"mines","type":"uint256"},
        {"indexed":false,"internalType":"uint256","name":"gems","type":"uint256"},
        {"indexed":false,"internalType":"bytes32","name":"gameStateHash","type":"bytes32"}
     ],
     "name":"GameStarted",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},
        {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}
     ],
     "name":"OwnershipTransferred",
     "type":"event"
  },
  {
     "inputs":[],
     "name":"MAX_BET",
     "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[],
     "name":"MIN_BET",
     "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[],
     "name":"deposit",
     "outputs":[],
     "stateMutability":"payable",
     "type":"function"
  },
  {
     "inputs":[
        {"internalType":"uint256","name":"revealedGems","type":"uint256"},
        {"internalType":"uint256","name":"multiplier","type":"uint256"},
        {"internalType":"bytes32","name":"gameStateHash","type":"bytes32"}
     ],
     "name":"endGame",
     "outputs":[],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[{"internalType":"address","name":"","type":"address"}],
     "name":"games",
     "outputs":[
        {"internalType":"address","name":"player","type":"address"},
        {"internalType":"uint256","name":"betAmount","type":"uint256"},
        {"internalType":"uint256","name":"mines","type":"uint256"},
        {"internalType":"uint256","name":"gems","type":"uint256"},
        {"internalType":"bytes32","name":"gameStateHash","type":"bytes32"},
        {"internalType":"bool","name":"isActive","type":"bool"}
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[{"internalType":"address","name":"player","type":"address"}],
     "name":"getBalance",
     "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[{"internalType":"address","name":"player","type":"address"}],
     "name":"getGameState",
     "outputs":[
        {"internalType":"bool","name":"isActive","type":"bool"},
        {"internalType":"uint256","name":"betAmount","type":"uint256"},
        {"internalType":"uint256","name":"mines","type":"uint256"},
        {"internalType":"uint256","name":"gems","type":"uint256"},
        {"internalType":"bytes32","name":"gameStateHash","type":"bytes32"}
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[],
     "name":"owner",
     "outputs":[{"internalType":"address","name":"","type":"address"}],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[],
     "name":"ownerWithdraw",
     "outputs":[],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[{"internalType":"address","name":"","type":"address"}],
     "name":"playerBalances",
     "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[],
     "name":"renounceOwnership",
     "outputs":[],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {"internalType":"uint256","name":"betAmount","type":"uint256"},
        {"internalType":"uint256","name":"mines","type":"uint256"},
        {"internalType":"uint256","name":"gems","type":"uint256"},
        {"internalType":"bytes32","name":"gameStateHash","type":"bytes32"}
     ],
     "name":"startGame",
     "outputs":[],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[{"internalType":"address","name":"newOwner","type":"address"}],
     "name":"transferOwnership",
     "outputs":[],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],
     "name":"withdraw",
     "outputs":[],
     "stateMutability":"nonpayable",
     "type":"function"
  }
];

const contractAddress = "0x848760d34317bbe065Ed993f4bFff61d5817DA5B";

const MinesGame = () => {
  const [size] = useState(5);
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [mines, setMines] = useState(3);
  const [gems, setGems] = useState(22);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [potentialWin, setPotentialWin] = useState(0);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [gameStateHash, setGameStateHash] = useState(null);
  const [revealedGems, setRevealedGems] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  useEffect(() => {
    initializeEthers();
  }, []);

  useEffect(() => {
    initializeGame();
  }, [size, mines]);

  const initializeEthers = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected accounts:", accounts);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        const signerAddress = await newSigner.getAddress();
        console.log("Signer address:", signerAddress);
        const gameContract = new ethers.Contract(contractAddress, contractABI, newSigner);
        setContract(gameContract);
        await updateBalance(gameContract, newSigner);
      } catch (error) {
        console.error("Error initializing ethers:", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const updateBalance = async (contractInstance, signerInstance) => {
    if (contractInstance && signerInstance) {
      try {
        const address = await signerInstance.getAddress();
        console.log("Fetching balance for address:", address);
        const balance = await contractInstance.playerBalances(address);
        console.log("Raw balance:", balance.toString());
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error updating balance:", error);
        setBalance("0");
      }
    }
  };

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
    setRevealedGems(0);
    
    // Generate game state hash
    const gameStateHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(newBoard)));
    setGameStateHash(gameStateHash);
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
      setRevealedGems(revealedCount);
      const newMultiplier = calculateMultiplier(revealedCount);
      setCurrentMultiplier(newMultiplier);
      setPotentialWin(betAmount * newMultiplier);
    }
  };

  const handleLoss = async () => {
    setGameStarted(false);
    try {
      const tx = await contract.endGame(revealedGems, 0, gameStateHash);
      await tx.wait();
      await updateBalance(contract, signer);
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  const handleDeposit = async () => {
    if (contract && signer && depositAmount > 0) {
      try {
        const depositValue = ethers.parseEther(depositAmount.toString());
        const tx = await contract.deposit({ value: depositValue });
        await tx.wait();
        console.log("Deposit successful");
        await updateBalance(contract, signer);
        setDepositAmount(0);
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }
  };

  const handleBetCashout = async () => {
    if (!gameStarted) {
      if (betAmount > 0 && betAmount <= parseFloat(balance)) {
        try {
          const tx = await contract.startGame(ethers.parseEther(betAmount.toString()), mines, gems, gameStateHash);
          await tx.wait();
          setGameStarted(true);
          await updateBalance(contract, signer);
        } catch (error) {
          console.error("Error starting game:", error);
        }
      }
    } else {
      try {
        const multiplier = Math.floor(currentMultiplier * 100); // Convert to integer for contract
        const tx = await contract.endGame(revealedGems, multiplier, gameStateHash);
        await tx.wait();
        setGameStarted(false);
        await updateBalance(contract, signer);
      } catch (error) {
        console.error("Error ending game:", error);
      }
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
            className={`w-28 h-28 m-1 rounded-md flex items-center justify-center ${
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
      <div className="w-2/4 pr-8 flex flex-col justify-center">
        <div className="mb-4">
          <label className="block mb-2">Balance</label>
          <div className="bg-gray-800 text-white p-2 rounded w-full">
            ${parseFloat(balance).toFixed(2)}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Deposit Amount</label>
          <div className="flex items-center">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded-l w-full"
              step="0.01"
            />
            <button 
              className="bg-yellow-500 p-2 rounded-r"
              onClick={handleDeposit}
            >
              Deposit
            </button>
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
              step="0.01"
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
          disabled={!gameStarted && betAmount > parseFloat(balance)}
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