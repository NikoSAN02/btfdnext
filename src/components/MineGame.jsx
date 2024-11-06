"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';

import { X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import MineGameJSON from './contract/MineGame.json';

// ABI and contract address would be imported from separate files in a real project
// Correct ABI from the provided JSON
const contractABI = [
   {
      "inputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"constructor"
   },
   {
      "inputs":[
         
      ],
      "name":"ECDSAInvalidSignature",
      "type":"error"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"length",
            "type":"uint256"
         }
      ],
      "name":"ECDSAInvalidSignatureLength",
      "type":"error"
   },
   {
      "inputs":[
         {
            "internalType":"bytes32",
            "name":"s",
            "type":"bytes32"
         }
      ],
      "name":"ECDSAInvalidSignatureS",
      "type":"error"
   },
   {
      "inputs":[
         
      ],
      "name":"FailedCall",
      "type":"error"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"balance",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"needed",
            "type":"uint256"
         }
      ],
      "name":"InsufficientBalance",
      "type":"error"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"owner",
            "type":"address"
         }
      ],
      "name":"OwnableInvalidOwner",
      "type":"error"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"account",
            "type":"address"
         }
      ],
      "name":"OwnableUnauthorizedAccount",
      "type":"error"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"Deposit",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"validUntil",
            "type":"uint256"
         }
      ],
      "name":"GameAuthorizationSet",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"winAmount",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"bytes32",
            "name":"gameStateHash",
            "type":"bytes32"
         }
      ],
      "name":"GameEnded",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"betAmount",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"mines",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"gems",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"bytes32",
            "name":"gameStateHash",
            "type":"bytes32"
         }
      ],
      "name":"GameStarted",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"LargeWithdrawalRequested",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"previousOwner",
            "type":"address"
         },
         {
            "indexed":true,
            "internalType":"address",
            "name":"newOwner",
            "type":"address"
         }
      ],
      "name":"OwnershipTransferred",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"address",
            "name":"account",
            "type":"address"
         }
      ],
      "name":"Paused",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"address",
            "name":"account",
            "type":"address"
         }
      ],
      "name":"Unpaused",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"Withdrawal",
      "type":"event"
   },
   {
      "inputs":[
         
      ],
      "name":"LARGE_WITHDRAWAL_DELAY",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"MAX_BET",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"MAX_MULTIPLIER",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"MAX_TOTAL_BALANCE",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"MIN_BET",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"completeLargeWithdrawal",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"bytes",
            "name":"signature",
            "type":"bytes"
         }
      ],
      "name":"deposit",
      "outputs":[
         
      ],
      "stateMutability":"payable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"gameAuthorizations",
      "outputs":[
         {
            "internalType":"bytes",
            "name":"signature",
            "type":"bytes"
         },
         {
            "internalType":"uint256",
            "name":"signedAt",
            "type":"uint256"
         },
         {
            "internalType":"bool",
            "name":"isValid",
            "type":"bool"
         },
         {
            "internalType":"uint256",
            "name":"validUntil",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"games",
      "outputs":[
         {
            "internalType":"address",
            "name":"player",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"betAmount",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"mines",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"gems",
            "type":"uint256"
         },
         {
            "internalType":"bytes32",
            "name":"gameStateHash",
            "type":"bytes32"
         },
         {
            "internalType":"bool",
            "name":"isActive",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"player",
            "type":"address"
         }
      ],
      "name":"getBalance",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"player",
            "type":"address"
         }
      ],
      "name":"getGameState",
      "outputs":[
         {
            "internalType":"bool",
            "name":"isActive",
            "type":"bool"
         },
         {
            "internalType":"uint256",
            "name":"betAmount",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"mines",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"gems",
            "type":"uint256"
         },
         {
            "internalType":"bytes32",
            "name":"gameStateHash",
            "type":"bytes32"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"largeWithdrawals",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"requestTime",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"owner",
      "outputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"ownerWithdraw",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"pause",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"paused",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"playerBalances",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"revealedGems",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"multiplier",
            "type":"uint256"
         }
      ],
      "name":"processGameOutcome",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"renounceOwnership",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"newMinBet",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"newMaxBet",
            "type":"uint256"
         }
      ],
      "name":"setBetLimits",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"betAmount",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"mines",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"gems",
            "type":"uint256"
         },
         {
            "internalType":"bytes32",
            "name":"gameStateHash",
            "type":"bytes32"
         }
      ],
      "name":"startGame",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"newOwner",
            "type":"address"
         }
      ],
      "name":"transferOwnership",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"unpause",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"withdraw",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   }
];

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ;

const MinesGame = () => {
  const [isOpen, setIsOpen] = useState(false)
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
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);
  const [gameStatus, setGameStatus] = useState('idle'); // Can be 'idle', 'playing', 'won', or 'lost'

  const [gameSignature, setGameSignature] = useState(null);
  const [processingTransaction, setProcessingTransaction] = useState(false);
  const [needsSignature, setNeedsSignature] = useState(false);


  const checkOwnerAndPauseStatus = async () => {
    if (!contract || !signer) return;
    
    try {
      const address = await signer.getAddress();
      const contractOwner = await contract.owner();
      setIsOwner(address.toLowerCase() === contractOwner.toLowerCase());
    } catch (error) {
      console.error("Error checking owner status:", error);
    }
  };

  useEffect(() => {
    initializeEthers();
  }, []);

  useEffect(() => {
    if (contract && signer) {
      checkGameAuthorization();
      checkGameInProgress();
      updateBalance();
    }
  }, [contract, signer]);

  useEffect(() => {
    initializeGame();
  }, [size, mines]);

  const togglePause = async () => {
    if (!contract || !signer || !isOwner) return;
    
    try {
      const tx = isPaused 
        ? await contract.unpause()
        : await contract.pause();
      
      await tx.wait();
      setIsPaused(!isPaused);
      console.log(isPaused ? "Contract unpaused" : "Contract paused");
    } catch (error) {
      console.error("Error toggling pause state:", error);
    }
  };

  const SignatureRequest = () => {
   if (needsSignature) {
       return (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-4 rounded text-black">
                   <p>Please authorize game actions</p>
                   <button 
                       onClick={handleDeposit} 
                       className="mt-4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
                   >
                       Sign
                   </button>
               </div>
           </div>
       );
   }
   return null;
};

  // Function to get authorization signature without deposit
const getGameAuthorization = async () => {
   if (!contract || !signer) return null;
   
   try {
       const address = await signer.getAddress();
       const chainId = await signer.provider.getNetwork().then(n => n.chainId);
       const timestamp = Math.floor(Date.now() / 1000);
       
       // Create the message hash
       const messageData = ethers.AbiCoder.defaultAbiCoder().encode(
           ['string', 'address', 'uint256', 'uint256'],
           ['AUTHORIZE_MINES_GAME', address, chainId, timestamp]
       );
       
       const innerHash = ethers.keccak256(messageData);
       const signature = await signer.signMessage(ethers.getBytes(innerHash));
       
       // Store signature in sessionStorage instead of localStorage for better security
       sessionStorage.setItem('gameSignature', signature);
       setGameSignature(signature);
       setNeedsSignature(false);
       
       return signature;
   } catch (error) {
       console.error("Error getting game authorization:", error);
       return null;
   }
};

const checkGameState = async () => {
  try {
      const address = await signer.getAddress();
      const gameState = await contract.getGameState(address);
      console.log("Current game state:", {
          isActive: gameState.isActive,
          betAmount: ethers.formatEther(gameState.betAmount),
          mines: Number(gameState.mines),
          gems: Number(gameState.gems),
          gameStateHash: gameState.gameStateHash
      });
      return gameState;
  } catch (error) {
      console.error("Error checking game state:", error);
      return null;
  }
};

  const initializeEthers = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        const gameContract = new ethers.Contract(contractAddress, contractABI, newSigner);
        setContract(gameContract);
      } catch (error) {
        console.error("Error initializing ethers:", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const checkGameInProgress = async () => {
   try {
       const address = await signer.getAddress();
       const gameState = await contract.getGameState(address);
       
       if (gameState.isActive) {
           // Check for stored signature
           const signature = sessionStorage.getItem('gameSignature');
           if (!signature) {
               setNeedsSignature(true);
               return;
           }

           setGameStarted(true);
           setGameStatus('playing');
           setBetAmount(ethers.formatEther(gameState.betAmount));
           setMines(Number(gameState.mines));
           setGems(Number(gameState.gems));
           setGameStateHash(gameState.gameStateHash);
           setGameSignature(signature);
           console.log("Game in progress restored");
       }
   } catch (error) {
       console.error("Error checking game state:", error);
   }
};

  const updateBalance = async () => {
    if (contract && signer) {
      try {
        const address = await signer.getAddress();
        const balance = await contract.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error updating balance:", error);
        setBalance("0");
      }
    }
  };

 // Update the initializeGame function
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
   setGameStarted(false);
   setGameStatus('idle');
   
   const gameStateHash = getGameStateHash();
   console.log("Game Initialized:", {
       mines,
       gems: size * size - mines,
       gameStateHash,
       board: newBoard.map(row => row.map(cell => cell ? '1' : '0').join('')).join('')
   });
   
   setGameStateHash(gameStateHash);
};



// Add error boundary component
const GameErrorBoundary = ({ children }) => {
   const [hasError, setHasError] = useState(false);

   if (hasError) {
       return (
           <div className="p-4 bg-red-100 text-red-700 rounded">
               <h2>Something went wrong with the game.</h2>
               <button 
                   onClick={() => {
                       setHasError(false);
                       initializeGame();
                   }}
                   className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
               >
                   Reset Game
               </button>
           </div>
       );
   }

   return children;
};

const handleLoss = () => handleGameOutcome(false);

const checkGameAuthorization = async () => {
   if (!contract || !signer) return false;
   
   try {
       const address = await signer.getAddress();
       const auth = await contract.gameAuthorizations(address);
       
       if (auth.isValid && auth.validUntil * 1000n > BigInt(Date.now())) {
           const signature = sessionStorage.getItem('gameSignature');
           if (signature) {
               setGameSignature(signature);
               return true;
           }
           
           setNeedsSignature(true);
           return false;
       }
       return false;
   } catch (error) {
       console.error("Error checking authorization:", error);
       return false;
   }
};

const handleDeposit = async () => {
   if (!contract || !signer || depositAmount <= 0) return;
   
   try {
       setProcessingTransaction(true);
       
       // Get current address and chain ID
       const address = await signer.getAddress();
       const chainId = await signer.provider.getNetwork().then(n => n.chainId);
       
       // Create the message to sign - EXACTLY as in the contract
       const messageToSign = ethers.solidityPacked(
           ['address', 'uint256', 'string'],
           [address, chainId, 'AUTHORIZE_DEPOSIT']
       );
       
       // Hash the message
       const messageHash = ethers.keccak256(messageToSign);
       
       // Sign the hash - this will automatically add the Ethereum Signed Message prefix
       const signature = await signer.signMessage(ethers.getBytes(messageHash));
       
       // Log all the details for debugging
       console.log('Signing Details:', {
           address,
           chainId: chainId.toString(),
           messageToSign,
           messageHash,
           signature
       });

       // Verify the signature locally before sending
       const recoveredAddress = ethers.verifyMessage(
           ethers.getBytes(messageHash),
           signature
       );

       console.log('Signature Verification:', {
           originalSigner: address.toLowerCase(),
           recoveredSigner: recoveredAddress.toLowerCase(),
           matches: address.toLowerCase() === recoveredAddress.toLowerCase()
       });

       if (address.toLowerCase() !== recoveredAddress.toLowerCase()) {
           throw new Error('Local signature verification failed');
       }

       // Store the signature
       sessionStorage.setItem('gameSignature', signature);
       setGameSignature(signature);

       // Send the transaction
       const tx = await contract.deposit(signature, {
           value: ethers.parseEther(depositAmount.toString()),
           gasLimit: 300000
       });

       console.log('Transaction sent:', tx.hash);

       const receipt = await tx.wait();
       console.log('Transaction receipt:', receipt);

       await updateBalance();
       setDepositAmount(0);
       setNeedsSignature(false);

   } catch (error) {
       console.error('Deposit Error:', error);
       
       // Detailed error logging
       if (error.transaction) {
           console.error('Failed Transaction:', {
               hash: error.transaction.hash,
               from: error.transaction.from,
               to: error.transaction.to,
               data: error.transaction.data,
               value: error.transaction.value
           });
       }
       
       if (error.receipt) {
           console.error('Transaction Receipt:', error.receipt);
       }

       alert(`Deposit failed: ${error.message || 'Unknown error'}`);
   } finally {
       setProcessingTransaction(false);
   }
};

// Add this helper function to verify signatures
const verifySignatureLocally = async (signature) => {
   const address = await signer.getAddress();
   const chainId = await signer.provider.getNetwork().then(n => n.chainId);
   
   const messageToSign = ethers.solidityPacked(
       ['address', 'uint256', 'string'],
       [address, chainId, 'AUTHORIZE_DEPOSIT']
   );
   
   const messageHash = ethers.keccak256(messageToSign);
   const recoveredAddress = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
   
   return {
       isValid: address.toLowerCase() === recoveredAddress.toLowerCase(),
       originalAddress: address,
       recoveredAddress: recoveredAddress
   };
};

// Optional: Add this test function to your component
const testSignature = async () => {
   if (!contract || !signer) {
       console.error('Contract or signer not initialized');
       return;
   }

   try {
       const address = await signer.getAddress();
       const chainId = await signer.provider.getNetwork().then(n => n.chainId);
       
       const messageToSign = ethers.solidityPacked(
           ['address', 'uint256', 'string'],
           [address, chainId, 'AUTHORIZE_DEPOSIT']
       );
       
       const messageHash = ethers.keccak256(messageToSign);
       const signature = await signer.signMessage(ethers.getBytes(messageHash));
       
       const verification = await verifySignatureLocally(signature);
       
       console.log('Signature Test Results:', {
           messageToSign,
           messageHash,
           signature,
           verification
       });
       
       return verification;
   } catch (error) {
       console.error('Signature Test Error:', error);
       return null;
   }
};

const verifySignature = async (signature) => {
   if (!contract || !signer) return;
   
   try {
       const address = await signer.getAddress();
       const chainId = await signer.provider.getNetwork().then(n => n.chainId);
       const timestamp = Math.floor(Date.now() / 1000);
       
       const messageData = ethers.solidityPacked(
           ['string', 'address', 'uint256', 'uint256'],
           ['AUTHORIZE_MINES_GAME', address, chainId, timestamp]
       );
       
       const messageHash = ethers.keccak256(messageData);
       const recoveredAddress = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
       
       console.log("Signature verification:", {
           originalSigner: address,
           recoveredSigner: recoveredAddress,
           matches: address.toLowerCase() === recoveredAddress.toLowerCase()
       });
       
       return address.toLowerCase() === recoveredAddress.toLowerCase();
   } catch (error) {
       console.error("Error verifying signature:", error);
       return false;
   }
};

const SignaturePrompt = () => {
   if (needsSignature) {
       return (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-4 rounded text-black">
                   <p>Please sign to continue your game</p>
                   <button 
                       onClick={getGameAuthorization}
                       className="mt-4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
                   >
                       Sign
                   </button>
               </div>
           </div>
       );
   }
   return null;
};

// Add to your useEffect cleanup
useEffect(() => {
   return () => {
       // Clear signature on unmount
       sessionStorage.removeItem('gameSignature');
   };
}, []);

useEffect(() => {
  if (contract) {
      // Log contract interface info
      console.log("Contract interface:", {
          deposit: contract.interface.getFunction('deposit'),
          abi: contract.interface.format()
      });
  }
}, [contract]);


const showTransactionStatus = () => {
  if (processingTransaction || gameStatus === 'processing') {
      return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded text-black flex flex-col items-center">
                  <div className="mb-2">Processing transaction...</div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
          </div>
      );
  }
  return null;
};

  const handleWithdraw = async () => {
    if (contract && signer && withdrawAmount > 0) {
      try {
        setWithdrawalStatus('pending');
        const withdrawValue = ethers.parseEther(withdrawAmount.toString());
        const tx = await contract.withdraw(withdrawValue);
        await tx.wait();
        console.log("Withdrawal successful");
        await updateBalance();
        setWithdrawAmount(0);
        setWithdrawalStatus('success');
      } catch (error) {
        console.error("Error withdrawing:", error);
        setWithdrawalStatus('error');
      }
    }
  };

  // Update handleTileClick
const handleTileClick = async (x, y) => {
   if (gameStatus !== 'playing') return;
   
   if (!gameSignature) {
       setNeedsSignature(true);
       return;
   }

   const newRevealed = [...revealed];
   newRevealed[y][x] = true;
   setRevealed(newRevealed);

   if (board[y][x]) {
       // Hit mine - process loss automatically
       await handleLoss();
   } else {
       const newRevealedGems = revealedGems + 1;
       setRevealedGems(newRevealedGems);
       const newMultiplier = calculateMultiplier(newRevealedGems);
       setCurrentMultiplier(newMultiplier);
       setPotentialWin(betAmount * newMultiplier);

       const allNonMinesRevealed = board.every((row, rowIndex) =>
           row.every((colIndex) => board[rowIndex][colIndex] || newRevealed[rowIndex][colIndex])
       );
       
       if (allNonMinesRevealed) {
           await handleWin();
       }
   }
};
  
  const calculateMultiplier = (clickCount) => {
    // Constants for multiplier calculation
    const totalTiles = size * size;  // 5x5 = 25 tiles
    const safeTiles = totalTiles - mines;  // number of non-mine tiles
    
    // Calculate probability based on remaining safe tiles
    const probability = (safeTiles - clickCount) / (totalTiles - clickCount);
    
    // House edge (98% payout)
    const houseEdge = 0.98;
    
    // Calculate multiplier with increasing bonus for each successful click
    const multiplier = (houseEdge / probability) * (1 + clickCount * 0.1);
    
    return multiplier;
};


  const handleWin = () => handleGameOutcome(true);

  const handleCashOutAll = async () => {
    console.log("Contract initialized:", !!contract);
    console.log("Signer initialized:", !!signer);
    console.log("Current balance:", balance);
    console.log("Parsed balance:", parseFloat(balance));
  
    if (contract && signer && parseFloat(balance) > 0) {
      try {
        setWithdrawalStatus('pending');
        
        const provider = signer.provider;
        
        // Get gas price
        let gasPrice;
        try {
          gasPrice = await provider.getGasPrice();
        } catch (gasError) {
          console.warn("Unable to get gas price from provider, using fallback methods");
          try {
            const feeData = await provider.getFeeData();
            gasPrice = feeData.gasPrice;
          } catch (feeDataError) {
            console.warn("Unable to get fee data, using getBlock method");
            const block = await provider.getBlock('latest');
            gasPrice = block.baseFeePerGas;
          }
        }
  
        if (!gasPrice) {
          console.warn("Unable to estimate gas price, using hardcoded fallback");
          gasPrice = ethers.parseUnits("20", "gwei"); // Fallback to 20 Gwei
        }
  
        console.log("Estimated gas price:", ethers.formatUnits(gasPrice, "gwei"), "Gwei");
  
        const withdrawalAmount = ethers.parseEther(balance);
        
        // Check player balance in the contract
        const playerAddress = await signer.getAddress();
        const playerBalance = await contract.playerBalances(playerAddress);
        console.log("Player balance in contract:", playerBalance.toString());
  
        if (typeof playerBalance === 'bigint' || playerBalance instanceof ethers.BigNumber) {
          if (playerBalance < withdrawalAmount) {
            throw new Error("Insufficient balance in the contract");
          }
        } else {
          // If playerBalance is not a BigNumber, convert both to numbers for comparison
          if (Number(playerBalance) < Number(withdrawalAmount)) {
            throw new Error("Insufficient balance in the contract");
          }
        }
  
        // Estimate gas limit with a buffer
        let gasLimit;
        try {
          gasLimit = await contract.withdraw.estimateGas(withdrawalAmount);
          console.log("Estimated gas limit:", gasLimit.toString());
          // Add a 20% buffer to the gas limit
          gasLimit = gasLimit * BigInt(120) / BigInt(100);
          console.log("Adjusted gas limit with buffer:", gasLimit.toString());
        } catch (gasEstimateError) {
          console.error("Error estimating gas:", gasEstimateError);
          // If gas estimation fails, use a high default value
          gasLimit = BigInt(300000); // Adjusted down from previous value
          console.log("Using default gas limit:", gasLimit.toString());
        }
  
        const gasCost = gasPrice * gasLimit;
        const gasCostEther = ethers.formatEther(gasCost);
        const safetyMargin = ethers.parseEther("0.0001");
        const maxWithdraw = withdrawalAmount - gasCost - safetyMargin;
        
        const MIN_WITHDRAWAL = ethers.parseEther("0.0001");
        if (maxWithdraw < MIN_WITHDRAWAL) {
          throw new Error("Withdrawal amount too small or insufficient balance to cover gas costs");
        }
        
        const confirmWithdraw = window.confirm(
          `Current gas price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei\n` +
          `Estimated gas limit: ${gasLimit.toString()}\n` +
          `Estimated gas cost: ${gasCostEther} ETH\n` +
          `You will receive approximately: ${ethers.formatEther(maxWithdraw)} ETH\n` +
          `Do you want to proceed with the withdrawal?`
        );
        
        if (!confirmWithdraw) {
          setWithdrawalStatus(null);
          return;
        }
        
        console.log("Sending transaction with parameters:", {
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toString(),
          withdrawAmount: ethers.formatEther(withdrawalAmount)
        });
  
        // Call the withdraw function with the withdrawal amount
        const tx = await contract.withdraw(withdrawalAmount, {
          gasLimit: gasLimit,
          gasPrice: gasPrice
        });
  
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        
        if (receipt.status === 0) {
          throw new Error("Transaction failed. The contract reverted the transaction.");
        }
  
        console.log("Full balance withdrawal successful");
        await updateBalance();
        setWithdrawalStatus('success');
      } catch (error) {
        console.error("Error withdrawing full balance:", error);
        console.error("Error details:", error.message);
        if (error.data) {
          console.error("Error data:", error.data);
        }
        setWithdrawalStatus('error');
        alert(`Withdrawal failed: ${error.message}`);
      }
    } else {
      console.error("Unable to process withdrawal: contract, signer, or balance not available");
      setWithdrawalStatus('error');
    }
  };

 // Update the handleBetCashout function to use the new hash
const handleBetCashout = async () => {
   if (!contract || !signer) return;

   if (gameStatus === 'idle') {
       try {
           // Validate inputs
           if (!betAmount || betAmount <= 0) {
               alert("Please enter a valid bet amount");
               return;
           }

           // Generate game state hash
           const gameStateHash = getGameStateHash();
           
           // Log game start parameters
           console.log('Starting Game:', {
               betAmount: ethers.parseEther(betAmount.toString()).toString(),
               mines,
               gems,
               gameStateHash
           });

           setGameStatus('processing');

           // Start the game
           const tx = await contract.startGame(
               ethers.parseEther(betAmount.toString()),
               mines,
               gems,
               gameStateHash,
               {
                   gasLimit: 500000
               }
           );

           console.log("Transaction sent:", tx.hash);
           
           const receipt = await tx.wait();
           
           // Verify the hash was accepted
           if (receipt.status === 1) {
               const hashVerified = await verifyGameStateHash(gameStateHash);
               if (!hashVerified) {
                   console.warn('Game state hash mismatch after transaction');
               }
               
               setGameStatus('playing');
               setGameStarted(true);
               await updateBalance();
           } else {
               throw new Error("Transaction failed");
           }

       } catch (error) {
           console.error("Error starting game:", error);
           setGameStatus('idle');
           alert(`Error starting game: ${error.message}`);
       }
   } else if (gameStatus === 'playing') {
       try {
           const winMultiplier = Math.floor(currentMultiplier * 100);
           await handleGameOutcome(true);
       } catch (error) {
           console.error("Error processing cashout:", error);
           alert("Error processing cashout. Please try again.");
       }
   }
};


// Add these helper functions
const validateGameConfig = () => {
   if (mines < 1 || mines >= 25) {
       throw new Error("Invalid number of mines");
   }
   if (gems !== 25 - mines) {
       throw new Error("Invalid number of gems");
   }
   if (betAmount <= 0) {
       throw new Error("Invalid bet amount");
   }
};

const getGameStateHash = () => {
   // Convert the board into a simple string representation
   const boardString = board.map(row => 
       row.map(cell => cell ? '1' : '0').join('')
   ).join('');

   // Pack the values in the same way as the contract
   const packedData = ethers.solidityPacked(
       ['string', 'uint256', 'uint256', 'uint256'],
       [boardString, mines, gems, ethers.parseEther(betAmount.toString())]
   );

   // Generate the hash
   const gameStateHash = ethers.keccak256(packedData);

   // Log the data for debugging
   console.log('Game State Hash Details:', {
       boardString,
       mines,
       gems,
       betAmount: ethers.parseEther(betAmount.toString()).toString(),
       packedData,
       gameStateHash
   });

   return gameStateHash;
};

// Helper function to verify the hash matches the contract's hash
const verifyGameStateHash = async (gameStateHash) => {
   if (!contract || !signer) return false;

   try {
       const address = await signer.getAddress();
       const gameState = await contract.getGameState(address);
       
       console.log('Game State Verification:', {
           clientHash: gameStateHash,
           contractHash: gameState.gameStateHash,
           matches: gameStateHash === gameState.gameStateHash
       });

       return gameStateHash === gameState.gameStateHash;
   } catch (error) {
       console.error('Error verifying game state hash:', error);
       return false;
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

  const handleGameOutcome = async (isWin) => {
   if (!contract || !signer) return;

   setGameStatus('processing');

   try {
       const winMultiplier = isWin ? Math.floor(currentMultiplier * 100) : 0;

       const tx = await contract.processGameOutcome(
           revealedGems,
           winMultiplier,
           { gasLimit: 300000 }
       );

       // Update UI immediately
       const allRevealed = board.map((row, rowIndex) =>
           row.map((cell, colIndex) => cell || revealed[rowIndex][colIndex])
       );
       setRevealed(allRevealed);

       // Handle transaction in background
       tx.wait()
           .then(() => {
               console.log("Game outcome processed");
               updateBalance();
               setTimeout(() => {
                   initializeGame();
                   setGameStatus('idle');
               }, 2000);
           })
           .catch(error => {
               console.error("Error confirming game outcome:", error);
               // Still reset UI even if transaction fails
               setTimeout(() => {
                   initializeGame();
                   setGameStatus('idle');
               }, 2000);
           });

   } catch (error) {
       console.error("Error processing game outcome:", error);
       setTimeout(() => {
           initializeGame();
           setGameStatus('idle');
       }, 2000);
   }
};


  const renderBoard = () => {
    
    return board.map((row, y) => (
      <div key={y} className="flex">
        {row.map((isMine, x) => (
          <button
            key={`${x}-${y}`}
            className={`w-[83px] h-[83px] m-1 rounded-[26px] flex items-center justify-center border-[#4A0943] border-2 cursor-pointer ${
              revealed[y][x]
                ? isMine
                  ? 'bg-red-500'
                  : 'bg-green-500'
                : 'bg-gradient-to-t from-[#26073B] to-[#000000]'
            }`}
            onClick={() => handleTileClick(x, y)}
            disabled={gameStatus !== 'playing'}
          >
             {revealed[y][x] ? (
                isMine ? (
                  <img src="/gamesvg/Candy.png" alt="Mine" className="w-[83px] h-[83px]" />
                ) : (
                  <img src="/gamesvg/wojackBhai.png" alt="Mine" className="w-[83px] h-[83px]" />
                )
              ) : (
                <svg width="47" height="45" viewBox="0 0 47 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.648 19.7069C0.6 19.6349 0.54 19.5509 0.468 19.4549C0.372 19.3589 0.324 19.2749 0.324 19.2029C0.3 19.1549 0.312 19.0949 0.36 19.0229C0.384 18.9269 0.396 18.8549 0.396 18.8069C0.444 18.6149 0.504 18.4349 0.576 18.2669C0.672 18.0989 0.756 17.9189 0.828 17.7269C1.02 17.2709 1.092 16.7669 1.044 16.2149C1.044 15.9509 1.008 15.6869 0.936 15.4229C0.888 15.1349 0.84 14.8589 0.792 14.5949C0.72 14.0189 0.708 13.4909 0.756 13.0109C0.804 12.6989 0.864 12.3869 0.936 12.0749C1.032 11.7629 1.116 11.4509 1.188 11.1389C1.308 10.6829 1.452 10.2389 1.62 9.80687C1.788 9.35087 1.992 8.91887 2.232 8.51087C2.52 8.03087 2.856 7.59887 3.24 7.21487C3.648 6.80687 4.02 6.38687 4.356 5.95487C4.5 5.73887 4.632 5.51087 4.752 5.27087C4.872 5.00687 4.98 4.75487 5.076 4.51487C5.172 4.27487 5.28 4.03487 5.4 3.79487C5.52 3.55487 5.676 3.33887 5.868 3.14687C6.012 3.05087 6.168 2.95487 6.336 2.85887C6.504 2.76287 6.66 2.67887 6.804 2.60687C6.972 2.51087 7.14 2.41487 7.308 2.31887C7.476 2.19887 7.644 2.09087 7.812 1.99487C8.028 1.82687 8.256 1.68287 8.496 1.56287C8.76 1.41887 9.024 1.32287 9.288 1.27487C9.672 1.17887 10.056 1.13087 10.44 1.13087C10.824 1.13087 11.208 1.10687 11.592 1.05887C12 0.986868 12.408 0.914868 12.816 0.842868C13.224 0.746867 13.632 0.710867 14.04 0.734867C14.232 0.734867 14.412 0.746867 14.58 0.770869C14.772 0.770869 14.952 0.794868 15.12 0.842868C15.192 0.866867 15.264 0.890868 15.336 0.914869C15.408 0.914869 15.468 0.926869 15.516 0.950868C15.564 0.974868 15.6 1.01087 15.624 1.05887C15.672 1.08287 15.72 1.10687 15.768 1.13087C15.792 1.17887 15.84 1.22687 15.912 1.27487C15.984 1.32287 16.032 1.37087 16.056 1.41887C16.08 1.44287 16.092 1.49087 16.092 1.56287C16.092 1.63487 16.092 1.69487 16.092 1.74287C16.092 1.79087 16.092 1.86287 16.092 1.95887C16.116 2.03087 16.116 2.09087 16.092 2.13887C16.068 2.16287 16.02 2.19887 15.948 2.24687C15.9 2.29487 15.864 2.33087 15.84 2.35487C15.792 2.40287 15.744 2.46287 15.696 2.53487C15.648 2.58287 15.588 2.61887 15.516 2.64287C15.492 2.66687 15.456 2.67887 15.408 2.67887C15.384 2.65487 15.36 2.65487 15.336 2.67887C15.24 2.67887 15.132 2.69087 15.012 2.71487C14.916 2.71487 14.82 2.71487 14.724 2.71487C14.604 2.71487 14.472 2.70287 14.328 2.67887C14.208 2.65487 14.076 2.64287 13.932 2.64287C13.668 2.59487 13.392 2.57087 13.104 2.57087C12.84 2.54687 12.576 2.54687 12.312 2.57087C12 2.59487 11.688 2.64287 11.376 2.71487C11.064 2.76287 10.752 2.82287 10.44 2.89487C10.224 2.94287 9.996 3.00287 9.756 3.07487C9.516 3.12287 9.288 3.19487 9.072 3.29087C8.544 3.55487 8.004 3.91487 7.452 4.37087C6.9 4.80287 6.456 5.29487 6.12 5.84687C5.904 6.18287 5.688 6.51887 5.472 6.85487C5.256 7.19087 5.04 7.52687 4.824 7.86287C4.608 8.22287 4.38 8.57087 4.14 8.90687C3.9 9.24287 3.684 9.60287 3.492 9.98687C3.3 10.3469 3.144 10.7309 3.024 11.1389C2.928 11.5469 2.832 11.9549 2.736 12.3629C2.688 12.6029 2.628 12.8429 2.556 13.0829C2.508 13.3229 2.472 13.5629 2.448 13.8029C2.424 14.1629 2.472 14.5829 2.592 15.0629C2.712 15.5429 2.808 16.0229 2.88 16.5029C2.976 16.9829 2.976 17.4029 2.88 17.7629C2.736 18.3629 2.424 18.8909 1.944 19.3469C1.848 19.4189 1.752 19.4909 1.656 19.5629C1.584 19.6349 1.488 19.6829 1.368 19.7069C1.248 19.7309 1.128 19.7549 1.008 19.7789C0.912 19.8029 0.792 19.7789 0.648 19.7069ZM15.048 4.47887C15.12 4.50287 15.204 4.53887 15.3 4.58687C15.396 4.63487 15.468 4.69487 15.516 4.76687C15.516 4.79087 15.516 4.83887 15.516 4.91087C15.54 4.95887 15.552 5.00687 15.552 5.05487C15.576 5.17487 15.588 5.29487 15.588 5.41487C15.612 5.53487 15.624 5.66687 15.624 5.81087C15.624 6.21887 15.636 6.63887 15.66 7.07087C15.708 7.47887 15.66 7.87487 15.516 8.25887C15.492 8.30687 15.468 8.36687 15.444 8.43887C15.444 8.51087 15.42 8.57087 15.372 8.61887C15.348 8.66687 15.3 8.71487 15.228 8.76287C15.18 8.78687 15.132 8.82287 15.084 8.87087C14.844 9.11087 14.568 9.29087 14.256 9.41087C13.968 9.53087 13.68 9.67487 13.392 9.84287C13.008 10.0349 12.648 10.2629 12.312 10.5269C12 10.7669 11.7 11.0309 11.412 11.3189C11.028 11.7029 10.692 12.1349 10.404 12.6149C10.14 13.0709 9.996 13.5629 9.972 14.0909C9.948 14.3549 9.96 14.6189 10.008 14.8829C10.08 15.1229 10.116 15.3749 10.116 15.6389C10.116 15.7349 10.104 15.8429 10.08 15.9629C10.08 16.0829 10.068 16.1909 10.044 16.2869C10.044 16.5749 9.996 16.8629 9.9 17.1509C9.828 17.4149 9.78 17.6789 9.756 17.9429C9.732 18.2069 9.708 18.4829 9.684 18.7709C9.684 19.0349 9.696 19.2989 9.72 19.5629C9.72 19.8269 9.732 20.0909 9.756 20.3549C9.804 20.6189 9.864 20.8709 9.936 21.1109C10.032 21.3509 10.14 21.5909 10.26 21.8309C10.38 22.0469 10.488 22.2749 10.584 22.5149C10.8 23.0429 10.98 23.5829 11.124 24.1349C11.292 24.6869 11.496 25.2269 11.736 25.7549C11.856 26.0909 12.024 26.4149 12.24 26.7269C12.456 27.0389 12.708 27.2909 12.996 27.4829C13.116 27.5549 13.224 27.6269 13.32 27.6989C13.416 27.7709 13.512 27.8309 13.608 27.8789C13.944 28.0709 14.292 28.2509 14.652 28.4189C15.012 28.5629 15.324 28.7789 15.588 29.0669C15.684 29.2109 15.768 29.3669 15.84 29.5349C15.912 29.7269 15.972 29.8949 16.02 30.0389C16.116 30.3749 16.152 30.6989 16.128 31.0109C16.128 31.0349 16.128 31.0709 16.128 31.1189C16.128 31.1909 16.128 31.2509 16.128 31.2989C16.104 31.3229 16.056 31.3469 15.984 31.3709C15.936 31.4189 15.9 31.4549 15.876 31.4789C15.852 31.4789 15.816 31.5029 15.768 31.5509C15.72 31.6229 15.684 31.6589 15.66 31.6589C15.612 31.6589 15.54 31.6229 15.444 31.5509C15.348 31.4789 15.276 31.4309 15.228 31.4069C15.06 31.3109 14.928 31.1789 14.832 31.0109C14.736 30.8669 14.628 30.7349 14.508 30.6149C14.316 30.3989 14.112 30.2189 13.896 30.0749C13.68 29.9309 13.452 29.7989 13.212 29.6789C12.972 29.5589 12.744 29.4269 12.528 29.2829C12.12 28.9709 11.7 28.6349 11.268 28.2749C10.86 27.8909 10.536 27.4709 10.296 27.0149C10.104 26.6789 9.972 26.3309 9.9 25.9709C9.852 25.5869 9.792 25.2149 9.72 24.8549C9.6 24.3269 9.432 23.7989 9.216 23.2709C9 22.7189 8.832 22.1789 8.712 21.6509C8.616 21.2429 8.568 20.8349 8.568 20.4269C8.592 19.9949 8.604 19.5749 8.604 19.1669C8.58 18.6389 8.52 18.1109 8.424 17.5829C8.328 17.0549 8.292 16.5269 8.316 15.9989C8.34 15.6149 8.376 15.2309 8.424 14.8469C8.496 14.4389 8.604 14.0549 8.748 13.6949C8.844 13.4309 8.952 13.1789 9.072 12.9389C9.192 12.6989 9.312 12.4469 9.432 12.1829C9.6 11.8229 9.744 11.4509 9.864 11.0669C10.008 10.6589 10.188 10.2749 10.404 9.91487C10.692 9.45887 11.052 9.07487 11.484 8.76287C11.916 8.45087 12.324 8.10287 12.708 7.71887C12.78 7.62287 12.864 7.52687 12.96 7.43087C13.08 7.33487 13.176 7.22687 13.248 7.10687C13.44 6.84287 13.584 6.54287 13.68 6.20687C13.776 5.87087 13.896 5.54687 14.04 5.23487C14.112 5.11487 14.184 5.01887 14.256 4.94687C14.328 4.85087 14.412 4.74287 14.508 4.62287C14.532 4.59887 14.556 4.56287 14.58 4.51487C14.628 4.46687 14.664 4.44287 14.688 4.44287C14.76 4.39487 14.88 4.40687 15.048 4.47887ZM1.656 22.8029C1.632 22.7309 1.596 22.6349 1.548 22.5149C1.5 22.3709 1.488 22.2629 1.512 22.1909C1.512 22.1189 1.548 22.0349 1.62 21.9389C1.716 21.8429 1.788 21.7589 1.836 21.6869C1.836 21.6629 1.836 21.6389 1.836 21.6149C1.86 21.5669 1.896 21.5429 1.944 21.5429C1.968 21.5429 1.992 21.5669 2.016 21.6149C2.04 21.6389 2.064 21.6629 2.088 21.6869C2.16 21.7109 2.232 21.7589 2.304 21.8309C2.4 21.8789 2.472 21.9389 2.52 22.0109C2.544 22.0589 2.556 22.1429 2.556 22.2629C2.556 22.3829 2.568 22.4789 2.592 22.5509C2.592 22.5989 2.592 22.6349 2.592 22.6589C2.616 22.6829 2.616 22.7189 2.592 22.7669C2.592 22.7909 2.544 22.8389 2.448 22.9109C2.376 22.9589 2.328 22.9949 2.304 23.0189C2.28 23.0429 2.232 23.0909 2.16 23.1629C2.112 23.2109 2.076 23.2349 2.052 23.2349C2.052 23.2349 2.028 23.2109 1.98 23.1629C1.932 23.1149 1.884 23.0669 1.836 23.0189C1.788 22.9709 1.728 22.8989 1.656 22.8029ZM6.192 33.2429C5.88 32.8349 5.604 32.4029 5.364 31.9469C5.148 31.4909 4.896 31.0469 4.608 30.6149C4.368 30.2549 4.116 29.8829 3.852 29.4989C3.588 29.1389 3.324 28.7669 3.06 28.3829C2.94 28.1909 2.82 27.9989 2.7 27.8069C2.58 27.5909 2.472 27.3749 2.376 27.1589C2.232 26.7989 2.172 26.4149 2.196 26.0069C2.196 25.9589 2.184 25.8989 2.16 25.8269C2.16 25.7549 2.172 25.6949 2.196 25.6469C2.196 25.5749 2.208 25.5149 2.232 25.4669C2.28 25.3949 2.328 25.3349 2.376 25.2869C2.376 25.2629 2.388 25.2149 2.412 25.1429C2.46 25.0469 2.496 24.9869 2.52 24.9629C2.568 24.9389 2.628 24.9269 2.7 24.9269C2.772 24.9029 2.82 24.8909 2.844 24.8909C2.892 24.8909 2.964 24.8789 3.06 24.8549C3.156 24.8069 3.228 24.7949 3.276 24.8189C3.3 24.8429 3.336 24.9149 3.384 25.0349C3.456 25.1309 3.504 25.1909 3.528 25.2149C3.552 25.2629 3.576 25.3109 3.6 25.3589C3.648 25.4069 3.684 25.4429 3.708 25.4669C3.756 25.5869 3.78 25.7189 3.78 25.8629C3.78 26.0069 3.804 26.1389 3.852 26.2589C3.948 26.4989 4.092 26.7389 4.284 26.9789C4.428 27.1709 4.608 27.3509 4.824 27.5189C5.04 27.6629 5.232 27.8309 5.4 28.0229C5.568 28.2149 5.712 28.4309 5.832 28.6709C5.952 28.8869 6.06 29.1149 6.156 29.3549C6.252 29.5949 6.336 29.8349 6.408 30.0749C6.48 30.3389 6.576 30.5789 6.696 30.7949C6.84 31.0589 7.02 31.2989 7.236 31.5149C7.308 31.6109 7.392 31.6949 7.488 31.7669C7.584 31.8389 7.656 31.9229 7.704 32.0189C7.752 32.0909 7.788 32.1749 7.812 32.2709C7.86 32.3669 7.896 32.4509 7.92 32.5229C7.944 32.5469 7.968 32.5709 7.992 32.5949C8.016 32.6429 8.028 32.6789 8.028 32.7029C8.028 32.7509 8.004 32.7989 7.956 32.8469C7.932 32.8949 7.908 32.9429 7.884 32.9909C7.86 33.0389 7.824 33.1109 7.776 33.2069C7.752 33.3029 7.716 33.3629 7.668 33.3869C7.62 33.4349 7.536 33.4709 7.416 33.4949C7.32 33.5189 7.236 33.5549 7.164 33.6029C7.14 33.6029 7.104 33.6149 7.056 33.6389C7.032 33.6629 7.008 33.6749 6.984 33.6749C6.936 33.6749 6.9 33.6629 6.876 33.6389C6.852 33.6149 6.828 33.5909 6.804 33.5669C6.708 33.5189 6.612 33.4709 6.516 33.4229C6.42 33.3749 6.312 33.3149 6.192 33.2429ZM15.012 33.3869C15.012 33.3869 15.06 33.3869 15.156 33.3869C15.252 33.4109 15.3 33.4229 15.3 33.4229C15.3 33.4229 15.276 33.4469 15.228 33.4949C15.18 33.5189 15.132 33.5549 15.084 33.6029C15.036 33.6509 14.976 33.6869 14.904 33.7109C14.856 33.7589 14.832 33.7829 14.832 33.7829C14.832 33.7829 14.844 33.7469 14.868 33.6749C14.868 33.5549 14.916 33.4589 15.012 33.3869ZM13.5 35.7269C13.452 35.7989 13.392 35.8949 13.32 36.0149C13.272 36.1349 13.2 36.2189 13.104 36.2669C13.08 36.3149 13.02 36.3389 12.924 36.3389C12.852 36.3629 12.792 36.3869 12.744 36.4109C12.696 36.4349 12.636 36.4589 12.564 36.4829C12.492 36.5309 12.432 36.5549 12.384 36.5549C12.336 36.5549 12.276 36.5429 12.204 36.5189C12.156 36.4949 12.12 36.4829 12.096 36.4829C12.024 36.4589 11.952 36.4349 11.88 36.4109C11.808 36.4109 11.736 36.3989 11.664 36.3749C11.448 36.2549 11.232 36.0989 11.016 35.9069C10.824 35.7149 10.62 35.5589 10.404 35.4389C10.236 35.3429 10.056 35.2589 9.864 35.1869C9.696 35.1389 9.528 35.0669 9.36 34.9709C9.312 34.9469 9.24 34.9109 9.144 34.8629C9.072 34.8389 9.024 34.8149 9 34.7909C8.976 34.7429 8.964 34.6709 8.964 34.5749C8.988 34.5029 8.988 34.4429 8.964 34.3949C8.964 34.3709 8.952 34.3229 8.928 34.2509C8.928 34.2029 8.94 34.1549 8.964 34.1069C8.988 34.0589 9.048 34.0109 9.144 33.9629C9.24 33.9149 9.312 33.8789 9.36 33.8549C9.672 33.6149 10.02 33.5069 10.404 33.5309C10.788 33.5789 11.16 33.6389 11.52 33.7109C11.712 33.7589 11.892 33.7589 12.06 33.7109C12.228 33.6869 12.396 33.6869 12.564 33.7109C12.636 33.7109 12.708 33.7229 12.78 33.7469C12.852 33.7709 12.912 33.7829 12.96 33.7829C13.008 33.8069 13.068 33.8189 13.14 33.8189C13.236 33.8429 13.308 33.8669 13.356 33.8909C13.38 33.9149 13.404 33.9629 13.428 34.0349C13.476 34.1309 13.512 34.2029 13.536 34.2509C13.56 34.2989 13.596 34.3469 13.644 34.3949C13.692 34.4669 13.716 34.5389 13.716 34.6109C13.74 34.6349 13.74 34.6709 13.716 34.7189C13.716 34.7909 13.716 34.8509 13.716 34.8989C13.692 35.0189 13.668 35.1389 13.644 35.2589C13.644 35.4029 13.596 35.5589 13.5 35.7269ZM29.3707 12.6509C29.2507 12.8429 29.1307 13.0469 29.0107 13.2629C28.8907 13.4789 28.7947 13.7069 28.7227 13.9469C28.6267 14.1869 28.5307 14.4269 28.4347 14.6669C28.3627 14.9069 28.2787 15.1469 28.1827 15.3869C28.0627 15.5789 27.9427 15.7709 27.8227 15.9629C27.7267 16.1309 27.6187 16.3109 27.4987 16.5029C27.3547 16.6949 27.1987 16.8869 27.0307 17.0789C26.8867 17.2709 26.7187 17.4389 26.5267 17.5829C26.4787 17.6309 26.4187 17.6789 26.3467 17.7269C26.2987 17.7749 26.2507 17.7989 26.2027 17.7989C26.1547 17.8229 26.1067 17.8349 26.0587 17.8349C26.0107 17.8349 25.9627 17.8469 25.9147 17.8709C25.8427 17.8709 25.7587 17.8829 25.6627 17.9069C25.5907 17.9309 25.5187 17.9309 25.4467 17.9069C25.2067 17.8829 24.9667 17.8109 24.7267 17.6909C24.4867 17.5709 24.2587 17.4509 24.0427 17.3309C23.6827 17.1869 23.3227 17.0669 22.9627 16.9709C22.4347 16.8029 21.8587 16.6709 21.2347 16.5749C20.6347 16.4789 20.0827 16.2749 19.5787 15.9629C19.2667 15.7709 18.9787 15.5069 18.7147 15.1709C18.4747 14.8109 18.3067 14.4509 18.2107 14.0909C18.1387 13.9229 18.0907 13.7549 18.0667 13.5869C18.0427 13.3949 18.0307 13.2029 18.0307 13.0109C18.0067 12.9389 17.9947 12.8669 17.9947 12.7949C17.9947 12.6989 17.9827 12.6149 17.9587 12.5429C17.8867 12.2789 17.7787 12.0509 17.6347 11.8589C17.5387 11.7629 17.4307 11.6909 17.3107 11.6429C17.1907 11.5709 17.0947 11.4869 17.0227 11.3909C16.9507 11.3189 16.8787 11.2109 16.8067 11.0669C16.7347 10.9229 16.6867 10.8029 16.6627 10.7069C16.6387 10.6589 16.6267 10.6109 16.6267 10.5629C16.6507 10.5149 16.6627 10.4669 16.6627 10.4189C16.6627 10.0829 16.7107 9.74687 16.8067 9.41087C16.8787 9.17087 16.9507 8.93087 17.0227 8.69087C17.1187 8.42687 17.2147 8.16287 17.3107 7.89887C17.3827 7.70687 17.4547 7.51487 17.5267 7.32287C17.5987 7.13087 17.6827 6.93887 17.7787 6.74687C18.0427 6.33887 18.4027 5.99087 18.8587 5.70287C19.0987 5.55887 19.3387 5.42687 19.5787 5.30687C19.8187 5.18687 20.0347 5.03087 20.2267 4.83887C20.5387 4.52687 20.7667 4.15487 20.9107 3.72287C21.0547 3.29087 21.2467 2.89487 21.4867 2.53487C21.5827 2.36687 21.7027 2.21087 21.8467 2.06687C21.9907 1.92287 22.1707 1.81487 22.3867 1.74287C22.5787 1.69487 22.7827 1.68287 22.9987 1.70687C23.2147 1.73087 23.4187 1.75487 23.6107 1.77887C23.7787 1.80287 23.9467 1.83887 24.1147 1.88687C24.3067 1.93487 24.4867 1.97087 24.6547 1.99487C25.0147 2.06687 25.3867 2.13887 25.7707 2.21087C26.1787 2.28287 26.5027 2.48687 26.7427 2.82287C26.8867 3.01487 26.9827 3.25487 27.0307 3.54287C27.1027 3.80687 27.1987 4.03487 27.3187 4.22687C27.4867 4.46687 27.6787 4.65887 27.8947 4.80287C27.9427 4.82687 28.0027 4.85087 28.0747 4.87487C28.1467 4.89887 28.2067 4.92287 28.2547 4.94687C28.4227 4.99487 28.6147 5.05487 28.8307 5.12687C29.0467 5.17487 29.2267 5.25887 29.3707 5.37887C29.5627 5.52287 29.7187 5.72687 29.8387 5.99087C29.9827 6.23087 30.1027 6.45887 30.1987 6.67487C30.3667 7.01087 30.5227 7.37087 30.6667 7.75487C30.8107 8.13887 30.8587 8.52287 30.8107 8.90687C30.7627 9.31487 30.6307 9.69887 30.4147 10.0589C30.2227 10.4189 30.0547 10.7789 29.9107 11.1389C29.8867 11.2829 29.8507 11.4149 29.8027 11.5349C29.7787 11.6549 29.7427 11.7749 29.6947 11.8949C29.6707 12.0149 29.6227 12.1349 29.5507 12.2549C29.5027 12.3509 29.4427 12.4829 29.3707 12.6509ZM28.2907 7.21487C28.0027 7.14287 27.7027 7.08287 27.3907 7.03487C27.0787 6.96287 26.7907 6.87887 26.5267 6.78287C26.4547 6.73487 26.3707 6.69887 26.2747 6.67487C26.1787 6.65087 26.1067 6.61487 26.0587 6.56687C26.0107 6.54287 25.9627 6.49487 25.9147 6.42287C25.8667 6.35087 25.8307 6.29087 25.8067 6.24287C25.7587 6.21887 25.7107 6.18287 25.6627 6.13487C25.6387 6.08687 25.6147 6.03887 25.5907 5.99087C25.5667 5.96687 25.5547 5.93087 25.5547 5.88287C25.5547 5.81087 25.5547 5.76287 25.5547 5.73887C25.5307 5.64287 25.5067 5.55887 25.4827 5.48687C25.4827 5.41487 25.4827 5.34287 25.4827 5.27087C25.4587 5.12687 25.4587 4.99487 25.4827 4.87487C25.5067 4.73087 25.5067 4.59887 25.4827 4.47887C25.4587 4.40687 25.4227 4.33487 25.3747 4.26287C25.3507 4.19087 25.3267 4.13087 25.3027 4.08287C25.3027 4.03487 25.2907 3.98687 25.2667 3.93887C25.2427 3.86687 25.2187 3.81887 25.1947 3.79487C25.1707 3.74687 25.1107 3.71087 25.0147 3.68687C24.9427 3.63887 24.8827 3.59087 24.8347 3.54287C24.6427 3.44687 24.4867 3.39887 24.3667 3.39887C24.2707 3.37487 24.1747 3.36287 24.0787 3.36287C23.9827 3.33887 23.8867 3.33887 23.7907 3.36287C23.5267 3.38687 23.2747 3.47087 23.0347 3.61487C22.8187 3.73487 22.6387 3.87887 22.4947 4.04687C22.3027 4.23887 22.1467 4.45487 22.0267 4.69487C21.9067 4.93487 21.7507 5.15087 21.5587 5.34287C21.1987 5.72687 20.7667 6.00287 20.2627 6.17087C19.7587 6.33887 19.3147 6.60287 18.9307 6.96287C18.6667 7.20287 18.4507 7.52687 18.2827 7.93487C18.2107 8.15087 18.1747 8.35487 18.1747 8.54687C18.1747 8.61887 18.1627 8.70287 18.1387 8.79887C18.1387 8.87087 18.1507 8.94287 18.1747 9.01487C18.1747 9.06287 18.1867 9.12287 18.2107 9.19487C18.2587 9.24287 18.2947 9.29087 18.3187 9.33887C18.5107 9.74687 18.7867 10.1069 19.1467 10.4189C19.5067 10.7069 19.7467 11.0909 19.8667 11.5709C19.9147 11.8109 19.9147 12.0629 19.8667 12.3269C19.8187 12.5909 19.8067 12.8549 19.8307 13.1189C19.8307 13.1669 19.8427 13.2269 19.8667 13.2989C19.8907 13.3709 19.9027 13.4429 19.9027 13.5149C19.9267 13.5629 19.9387 13.6229 19.9387 13.6949C19.9387 13.7669 19.9627 13.8269 20.0107 13.8749C20.0347 13.9229 20.0707 13.9709 20.1187 14.0189C20.1907 14.0669 20.2387 14.1149 20.2627 14.1629C20.3107 14.1869 20.3587 14.2349 20.4067 14.3069C20.4547 14.3549 20.5027 14.3909 20.5507 14.4149C20.5987 14.4389 20.6587 14.4629 20.7307 14.4869C20.8027 14.4869 20.8747 14.4869 20.9467 14.4869C21.2587 14.5589 21.5707 14.5949 21.8827 14.5949C22.2187 14.5709 22.5427 14.5709 22.8547 14.5949C23.1667 14.6429 23.4667 14.7149 23.7547 14.8109C24.0667 14.9069 24.3787 14.9669 24.6907 14.9909C24.7627 14.9909 24.8467 15.0029 24.9427 15.0269C25.0387 15.0509 25.1227 15.0509 25.1947 15.0269C25.2427 15.0269 25.2907 15.0149 25.3387 14.9909C25.3867 14.9429 25.4347 14.9189 25.4827 14.9189C25.5307 14.8709 25.6027 14.8349 25.6987 14.8109C25.7947 14.7869 25.8667 14.7509 25.9147 14.7029C25.9867 14.6309 26.0707 14.5349 26.1667 14.4149C26.2627 14.2709 26.3347 14.1509 26.3827 14.0549C26.5267 13.7669 26.6227 13.4549 26.6707 13.1189C26.7187 12.7589 26.7547 12.4229 26.7787 12.1109C26.8027 11.9189 26.8267 11.7149 26.8507 11.4989C26.8987 11.2829 26.9587 11.0909 27.0307 10.9229C27.2227 10.4909 27.5227 10.1789 27.9307 9.98687C28.3627 9.79487 28.7227 9.53087 29.0107 9.19487C29.0587 9.14687 29.1067 9.09887 29.1547 9.05087C29.2267 8.97887 29.2867 8.90687 29.3347 8.83487C29.3587 8.76287 29.3707 8.69087 29.3707 8.61887C29.3707 8.52287 29.3707 8.43887 29.3707 8.36687C29.3947 8.31887 29.4067 8.27087 29.4067 8.22287C29.4307 8.15087 29.4427 8.10287 29.4427 8.07887C29.4187 8.03087 29.3947 8.00687 29.3707 8.00687C29.3467 7.98287 29.3227 7.95887 29.2987 7.93487C29.2507 7.86287 29.2027 7.80287 29.1547 7.75487C29.1067 7.68287 29.0587 7.61087 29.0107 7.53887C28.9387 7.46687 28.8307 7.40687 28.6867 7.35887C28.5667 7.31087 28.4347 7.26287 28.2907 7.21487ZM45.6188 24.9629C45.4988 25.5149 45.3188 26.1389 45.0788 26.8349C44.8388 27.5069 44.6228 28.1189 44.4308 28.6709C44.2628 29.1989 44.0948 29.8109 43.9268 30.5069C43.7588 31.2269 43.4708 31.8509 43.0628 32.3789C42.8228 32.6909 42.5348 32.9309 42.1988 33.0989C41.8868 33.2909 41.5508 33.4829 41.1908 33.6749C40.8548 33.8429 40.5428 34.0469 40.2548 34.2869C39.9668 34.5509 39.6548 34.7669 39.3188 34.9349C38.9588 35.1029 38.5748 35.2109 38.1668 35.2589C37.7588 35.3069 37.3628 35.3909 36.9788 35.5109C36.8588 35.5349 36.7268 35.5709 36.5828 35.6189C36.4628 35.6669 36.3428 35.7149 36.2228 35.7629C35.8148 35.9069 35.3948 36.0509 34.9628 36.1949C34.5308 36.3629 34.0988 36.4589 33.6668 36.4829C33.4508 36.5069 33.2348 36.4949 33.0188 36.4469C32.8028 36.4229 32.5988 36.3509 32.4068 36.2309C32.3588 36.1829 32.3108 36.1229 32.2628 36.0509C32.2388 36.0029 32.2028 35.9549 32.1548 35.9069C32.1068 35.8829 32.0588 35.8349 32.0108 35.7629C31.9628 35.7149 31.9268 35.6669 31.9028 35.6189C31.7828 35.4749 31.6988 35.2949 31.6508 35.0789C31.6028 34.8869 31.5668 34.6949 31.5428 34.5029C31.3988 33.6149 31.4708 32.6909 31.7588 31.7309C31.8068 31.4909 31.8788 31.2509 31.9748 31.0109C32.0708 30.7709 32.1428 30.5309 32.1908 30.2909C32.2628 29.9549 32.3108 29.6309 32.3348 29.3189C32.3828 28.9829 32.4788 28.6589 32.6228 28.3469C32.6468 28.2989 32.6708 28.2389 32.6948 28.1669C32.7188 28.0949 32.7548 28.0349 32.8028 27.9869C32.8268 27.9629 32.8628 27.9389 32.9108 27.9149C32.9588 27.8909 33.0068 27.8669 33.0548 27.8429C33.1028 27.7949 33.1628 27.7469 33.2348 27.6989C33.3068 27.6509 33.3788 27.6029 33.4508 27.5549C33.5708 27.5069 33.6908 27.4709 33.8108 27.4469C33.9548 27.4229 34.0868 27.3869 34.2068 27.3389C34.4708 27.2669 34.7108 27.1709 34.9268 27.0509C35.1668 26.9309 35.3708 26.7749 35.5388 26.5829C35.6828 26.4389 35.8028 26.2829 35.8988 26.1149C35.9948 25.9229 36.0788 25.7309 36.1508 25.5389C36.2948 25.2509 36.4148 24.9509 36.5108 24.6389C36.6068 24.3269 36.6668 24.0149 36.6908 23.7029C36.7388 23.3909 36.7628 23.0789 36.7628 22.7669C36.7868 22.4549 36.8348 22.1429 36.9068 21.8309C37.0028 21.3749 37.1468 20.9309 37.3388 20.4989C37.5308 20.0429 37.6508 19.5869 37.6988 19.1309C37.6988 18.8669 37.6748 18.6029 37.6268 18.3389C37.6028 18.0749 37.5788 17.8109 37.5548 17.5469C37.5308 17.1629 37.5308 16.7669 37.5548 16.3589C37.6028 15.9509 37.6028 15.5429 37.5548 15.1349C37.5308 14.7749 37.4588 14.4269 37.3388 14.0909C37.2428 13.7549 37.1468 13.4069 37.0508 13.0469C36.9548 12.6389 36.8588 12.2309 36.7628 11.8229C36.6908 11.4149 36.5228 11.0309 36.2588 10.6709C36.0428 10.3589 35.7668 10.0949 35.4308 9.87887C35.1188 9.66287 34.7948 9.45887 34.4588 9.26687C34.2428 9.17087 34.0148 9.06287 33.7748 8.94287C33.5348 8.82287 33.3188 8.66687 33.1268 8.47487C32.8388 8.21087 32.6228 7.89887 32.4788 7.53887C32.3348 7.17887 32.2388 6.80687 32.1908 6.42287C32.1908 6.15887 32.1908 5.89487 32.1908 5.63087C32.2148 5.36687 32.2268 5.10287 32.2268 4.83887C32.2028 4.45487 32.1428 4.07087 32.0468 3.68687C31.9748 3.27887 31.9868 2.88287 32.0828 2.49887C32.1068 2.42687 32.1308 2.35487 32.1548 2.28287C32.2028 2.21087 32.2508 2.13887 32.2988 2.06687C32.4188 1.77887 32.6108 1.55087 32.8748 1.38287C33.1388 1.21487 33.4268 1.10687 33.7388 1.05887C34.0508 1.03487 34.3868 1.04687 34.7468 1.09487C35.1068 1.11887 35.4548 1.13087 35.7908 1.13087C36.0788 1.10687 36.3788 1.08287 36.6908 1.05887C37.0268 1.03487 37.3388 1.05887 37.6268 1.13087C38.0108 1.20287 38.3588 1.35887 38.6708 1.59887C38.9828 1.81487 39.2948 2.03087 39.6068 2.24687C39.9188 2.46287 40.2548 2.65487 40.6148 2.82287C40.9748 2.99087 41.3108 3.19487 41.6228 3.43487C41.8148 3.60287 41.9828 3.79487 42.1268 4.01087C42.2948 4.22687 42.4748 4.43087 42.6668 4.62287C42.7148 4.69487 42.7748 4.76687 42.8468 4.83887C42.9428 4.88687 43.0268 4.93487 43.0988 4.98287C43.4108 5.27087 43.7588 5.49887 44.1428 5.66687C44.5508 5.83487 44.8748 6.09887 45.1148 6.45887C45.3788 6.81887 45.5108 7.20287 45.5108 7.61087C45.5108 7.99487 45.5108 8.39087 45.5108 8.79887C45.4868 9.37487 45.5348 9.90287 45.6548 10.3829C45.7988 10.9109 45.9788 11.4389 46.1948 11.9669C46.4348 12.4709 46.5908 12.9989 46.6628 13.5509C46.7348 13.9109 46.7228 14.3309 46.6268 14.8109C46.5308 15.2909 46.4348 15.7709 46.3388 16.2509C46.2428 16.7309 46.1828 17.1509 46.1588 17.5109C46.1588 18.0389 46.2428 18.5549 46.4108 19.0589C46.6028 19.5389 46.6628 20.0429 46.5908 20.5709C46.5188 20.9549 46.3868 21.3389 46.1948 21.7229C46.0268 22.0829 45.9068 22.4669 45.8348 22.8749C45.7628 23.1869 45.7148 23.5229 45.6908 23.8829C45.6908 24.2189 45.6668 24.5789 45.6188 24.9629ZM45.0428 19.3469C44.9708 19.1309 44.8868 18.9149 44.7908 18.6989C44.7188 18.4589 44.6708 18.2189 44.6468 17.9789C44.5988 17.4509 44.6588 16.9349 44.8268 16.4309C45.0188 15.9269 45.1148 15.4109 45.1148 14.8829C45.1148 14.3549 45.0068 13.8509 44.7908 13.3709C44.5748 12.8669 44.3948 12.3629 44.2508 11.8589C44.1068 11.3309 43.9988 10.7909 43.9268 10.2389C43.8548 9.68687 43.7108 9.14687 43.4948 8.61887C43.3508 8.25887 43.1588 7.92287 42.9188 7.61087C42.6788 7.29887 42.4388 6.98687 42.1988 6.67487C42.0308 6.48287 41.8748 6.27887 41.7308 6.06287C41.6108 5.84687 41.4548 5.64287 41.2628 5.45087C40.9988 5.16287 40.6988 4.91087 40.3628 4.69487C40.0268 4.47887 39.6908 4.26287 39.3548 4.04687C39.1628 3.92687 38.9588 3.80687 38.7428 3.68687C38.5268 3.54287 38.2988 3.43487 38.0588 3.36287C37.7228 3.24287 37.3748 3.17087 37.0148 3.14687C36.6548 3.12287 36.3068 3.12287 35.9708 3.14687C35.6828 3.14687 35.3708 3.18287 35.0348 3.25487C34.7228 3.32687 34.4588 3.47087 34.2428 3.68687C34.1948 3.71087 34.1468 3.75887 34.0988 3.83087C34.0748 3.90287 34.0508 3.96287 34.0268 4.01087C33.7388 4.44287 33.5828 4.92287 33.5588 5.45087C33.5588 5.52287 33.5588 5.59487 33.5588 5.66687C33.5588 5.73887 33.5588 5.81087 33.5588 5.88287C33.5588 5.90687 33.5708 5.94287 33.5948 5.99087C33.6428 6.03887 33.6668 6.08687 33.6668 6.13487C33.7148 6.18287 33.7508 6.25487 33.7748 6.35087C33.7988 6.42287 33.8348 6.49487 33.8828 6.56687C33.9068 6.59087 33.9428 6.61487 33.9908 6.63887C34.0388 6.66287 34.0748 6.68687 34.0988 6.71087C34.2668 6.85487 34.4348 6.97487 34.6028 7.07087C34.7948 7.16687 34.9868 7.26287 35.1788 7.35887C35.4188 7.50287 35.6228 7.65887 35.7908 7.82687C35.9828 7.99487 36.1508 8.18687 36.2948 8.40287C36.4628 8.59487 36.6548 8.77487 36.8708 8.94287C37.0868 9.08687 37.3148 9.20687 37.5548 9.30287C37.8188 9.37487 38.0588 9.49487 38.2748 9.66287C38.3468 9.71087 38.4428 9.79487 38.5628 9.91487C38.6828 10.0349 38.7668 10.1429 38.8148 10.2389C38.8148 10.2629 38.8148 10.3109 38.8148 10.3829C38.8388 10.4309 38.8508 10.4789 38.8508 10.5269C38.9228 10.8389 38.9468 11.1629 38.9228 11.4989C38.8988 11.8109 38.8868 12.1229 38.8868 12.4349C38.8868 12.7229 38.9348 13.0229 39.0308 13.3349C39.1508 13.6949 39.3188 14.0549 39.5348 14.4149C39.7508 14.7509 39.8588 15.1229 39.8588 15.5309C39.8588 15.7949 39.8108 16.0589 39.7148 16.3229C39.6188 16.5629 39.5468 16.8029 39.4988 17.0429C39.4028 17.4269 39.3668 17.8229 39.3908 18.2309C39.4388 18.6149 39.4268 19.0109 39.3548 19.4189C39.2828 19.8029 39.1508 20.1749 38.9588 20.5349C38.7908 20.8949 38.6708 21.2669 38.5988 21.6509C38.5268 22.0349 38.5148 22.4309 38.5628 22.8389C38.6108 23.2229 38.6228 23.6069 38.5988 23.9909C38.5748 24.5189 38.4308 25.0229 38.1668 25.5029C38.0468 25.7189 37.9148 25.9229 37.7708 26.1149C37.6268 26.3069 37.4828 26.4989 37.3388 26.6909C37.1708 26.9309 36.9908 27.1829 36.7988 27.4469C36.6068 27.6869 36.3908 27.9029 36.1508 28.0949C35.9108 28.3109 35.6348 28.5029 35.3228 28.6709C35.0348 28.8149 34.7828 29.0069 34.5668 29.2469C34.5188 29.2949 34.4588 29.3429 34.3868 29.3909C34.3388 29.4389 34.3028 29.4869 34.2788 29.5349C34.2548 29.5829 34.2308 29.6429 34.2068 29.7149C34.1828 29.7869 34.1708 29.8469 34.1708 29.8949C34.1228 30.0629 34.0748 30.2189 34.0268 30.3629C33.9788 30.5309 33.9428 30.6869 33.9188 30.8309C33.7988 31.2869 33.6428 31.7549 33.4508 32.2349C33.2828 32.7149 33.2708 33.1949 33.4148 33.6749C33.4388 33.7229 33.4508 33.7829 33.4508 33.8549C33.4748 33.9509 33.5108 34.0229 33.5588 34.0709C33.5828 34.1189 33.6188 34.1549 33.6668 34.1789C33.7388 34.2029 33.7868 34.2269 33.8108 34.2509C33.8588 34.2749 33.9068 34.3109 33.9548 34.3589C34.0268 34.4309 34.0868 34.4669 34.1348 34.4669C34.1828 34.4669 34.2308 34.4549 34.2788 34.4309C34.3508 34.4309 34.3988 34.4309 34.4228 34.4309C34.4948 34.4069 34.5668 34.3829 34.6388 34.3589C34.7348 34.3589 34.8188 34.3469 34.8908 34.3229C35.0348 34.2749 35.1548 34.2029 35.2508 34.1069C35.3708 34.0349 35.4908 33.9629 35.6108 33.8909C35.7068 33.8429 35.8148 33.7949 35.9348 33.7469C36.0788 33.6989 36.1988 33.6749 36.2948 33.6749C36.5588 33.6269 36.8228 33.6149 37.0868 33.6389C37.3508 33.6869 37.6148 33.6989 37.8788 33.6749C38.2148 33.6269 38.5268 33.5189 38.8148 33.3509C39.1028 33.1829 39.3788 32.9909 39.6428 32.7749C39.9308 32.5589 40.1948 32.3189 40.4348 32.0549C40.6988 31.8149 40.9508 31.5629 41.1908 31.2989C41.4548 31.0349 41.7188 30.7589 41.9828 30.4709C42.2708 30.2069 42.5228 29.9189 42.7388 29.6069C42.9788 29.2469 43.1708 28.8749 43.3148 28.4909C43.4828 28.1069 43.6388 27.7229 43.7828 27.3389C43.8788 27.0749 43.9748 26.8109 44.0708 26.5469C44.1668 26.2829 44.2388 26.0189 44.2868 25.7549C44.3828 25.3469 44.3948 24.9389 44.3228 24.5309C44.2748 24.1229 44.2748 23.7269 44.3228 23.3429C44.3708 22.8869 44.5148 22.4669 44.7548 22.0829C45.0188 21.6749 45.1868 21.2549 45.2588 20.8229C45.2828 20.7749 45.3068 20.7149 45.3308 20.6429C45.3548 20.5709 45.3668 20.5109 45.3668 20.4629C45.3668 20.2949 45.3308 20.1149 45.2588 19.9229C45.2108 19.7309 45.1388 19.5389 45.0428 19.3469ZM29.1573 44.1509C28.6053 44.2709 27.9333 44.3429 27.1413 44.3669C26.3733 44.3669 25.7133 44.3549 25.1613 44.3309C24.7533 44.2829 24.3453 44.2469 23.9373 44.2229C23.5533 44.1989 23.1573 44.1869 22.7493 44.1869C22.4853 44.2109 22.2213 44.2349 21.9573 44.2589C21.7173 44.2829 21.4653 44.3069 21.2013 44.3309C20.8653 44.3549 20.5173 44.3669 20.1573 44.3669C19.8213 44.3429 19.4853 44.3309 19.1493 44.3309C18.8373 44.3069 18.5133 44.2829 18.1773 44.2589C17.8653 44.2109 17.5773 44.1149 17.3133 43.9709C16.9533 43.8029 16.6533 43.5509 16.4133 43.2149C16.1973 42.8789 16.0893 42.5189 16.0893 42.1349C16.0653 41.8949 16.1013 41.6429 16.1973 41.3789C16.2933 41.1149 16.3893 40.8749 16.4853 40.6589C16.7733 40.1069 17.1573 39.6509 17.6373 39.2909C18.1413 38.9309 18.6573 38.6069 19.1853 38.3189C19.4733 38.1509 19.7613 38.0069 20.0493 37.8869C20.3613 37.7429 20.6733 37.6349 20.9853 37.5629C21.3453 37.4189 21.8493 37.3589 22.4973 37.3829C23.1453 37.4069 23.7933 37.4549 24.4413 37.5269C25.0893 37.5989 25.5933 37.6469 25.9533 37.6709C26.3373 37.6709 26.7333 37.6829 27.1413 37.7069C27.5493 37.7069 27.9093 37.8509 28.2213 38.1389C28.2933 38.1869 28.3533 38.2589 28.4013 38.3549C28.4733 38.4269 28.5333 38.5109 28.5813 38.6069C28.7733 38.8229 28.9533 39.0629 29.1213 39.3269C29.2893 39.5669 29.4813 39.7829 29.6973 39.9749C29.8893 40.1669 30.1053 40.3229 30.3453 40.4429C30.6093 40.5629 30.8253 40.7189 30.9933 40.9109C31.0413 40.9589 31.0773 41.0189 31.1013 41.0909C31.1493 41.1389 31.1973 41.1869 31.2453 41.2349C31.2693 41.2829 31.3053 41.3429 31.3533 41.4149C31.4013 41.4629 31.4373 41.5109 31.4613 41.5589C31.4853 41.6069 31.4973 41.6669 31.4973 41.7389C31.4973 41.8109 31.4973 41.8829 31.4973 41.9549C31.4973 42.0029 31.4973 42.0629 31.4973 42.1349C31.5213 42.2069 31.5333 42.2669 31.5333 42.3149C31.5093 42.3869 31.4733 42.4589 31.4253 42.5309C31.4013 42.5789 31.3773 42.6389 31.3533 42.7109C31.2093 43.0949 30.9813 43.3949 30.6693 43.6109C30.4773 43.7549 30.2493 43.8749 29.9853 43.9709C29.7213 44.0429 29.4453 44.1029 29.1573 44.1509ZM26.3133 39.1469C26.0733 39.0749 25.8213 39.0149 25.5573 38.9669C25.3173 38.9189 25.0653 38.8829 24.8013 38.8589C24.4893 38.8589 24.1773 38.8829 23.8653 38.9309C23.5533 38.9549 23.2533 38.9909 22.9653 39.0389C22.7253 39.0869 22.4853 39.1349 22.2453 39.1829C22.0053 39.2069 21.7893 39.2669 21.5973 39.3629C21.4773 39.4109 21.3453 39.4829 21.2013 39.5789C21.0813 39.6509 20.9733 39.7229 20.8773 39.7949C20.6853 39.9389 20.4933 40.0949 20.3013 40.2629C20.1093 40.4069 19.9293 40.5629 19.7613 40.7309C19.6413 40.8029 19.5093 40.8869 19.3653 40.9829C19.2453 41.0549 19.1373 41.1389 19.0413 41.2349C18.9693 41.3069 18.9093 41.3789 18.8613 41.4509C18.8133 41.5229 18.7653 41.5829 18.7173 41.6309C18.6933 41.6789 18.6693 41.7149 18.6453 41.7389C18.6213 41.7629 18.6093 41.7869 18.6093 41.8109C18.6093 41.8349 18.6213 41.8589 18.6453 41.8829C18.6933 41.9069 18.7293 41.9189 18.7533 41.9189C18.8253 41.9669 18.8973 42.0269 18.9693 42.0989C19.0413 42.1709 19.1013 42.2189 19.1493 42.2429C19.2213 42.2669 19.2933 42.2789 19.3653 42.2789C19.4373 42.2789 19.5093 42.2789 19.5813 42.2789C19.7733 42.3029 19.9653 42.3269 20.1573 42.3509C20.3493 42.3509 20.5413 42.3509 20.7333 42.3509C21.2613 42.3509 21.8373 42.3509 22.4613 42.3509C23.0853 42.3509 23.6613 42.3749 24.1893 42.4229C24.5493 42.4709 24.9093 42.5189 25.2693 42.5669C25.6293 42.6149 25.9773 42.6509 26.3133 42.6749C26.4813 42.6989 26.6613 42.7109 26.8533 42.7109C27.0693 42.7109 27.2613 42.6749 27.4293 42.6029C27.5013 42.5789 27.5733 42.5429 27.6453 42.4949C27.7413 42.4469 27.8253 42.3989 27.8973 42.3509C27.9213 42.3269 27.9453 42.3149 27.9693 42.3149C28.0173 42.2909 28.0533 42.2669 28.0773 42.2429C28.1013 42.2189 28.1133 42.1829 28.1133 42.1349C28.1373 42.0629 28.1613 42.0029 28.1853 41.9549C28.1853 41.9069 28.1973 41.8469 28.2213 41.7749C28.2693 41.7029 28.2933 41.6429 28.2933 41.5949C28.2933 41.5709 28.2813 41.5469 28.2573 41.5229C28.2573 41.4749 28.2573 41.4389 28.2573 41.4149C28.2333 41.3189 28.2093 41.2229 28.1853 41.1269C28.1613 41.0309 28.1373 40.9349 28.1133 40.8389C27.7533 40.0469 27.1533 39.4829 26.3133 39.1469Z" fill="#6E3769"/>
                </svg>
                


              )}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <>
     {showTransactionStatus()}
     {SignaturePrompt()}
    {(gameStatus === 'processing' || processingTransaction) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded">
                    Processing transaction...
                </div>
            </div>
        )}{<>
    <div className="flex bg-white/20 pt-5 pl-7 pr-7 text-white w-full justify-center  h-auto ">
      <div className="w-[450px] bg-[#120916] p-7 pt-7 pb-7  flex rounded-l-[40px] flex-col justify-center">
        <div className="mb-4">
          <label className="block mb-2">Balance</label>
          <div className='flex gap-2 justify-between'>
          <div className="bg-[#393841] text-white p-4 rounded-[20px] w-full  flex justify-between items-center">
            <span>${parseFloat(balance).toFixed(2)}</span>
            
          </div>
          <button 
              className="w-2/4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] cursor-pointer hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={handleCashOutAll}
              disabled={parseFloat(balance) <= 0}
            >
              Cash Out All
            </button>
            </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Deposit Amount</label>
            <div className='flex gap-2 justify-between'>
          <div className=" w-full flex justify-between items-center">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
              className=" bg-[#393841] text-white p-4 rounded-[20px] w-full"
              step="0.01"
            />
            
          </div>
          <button 
              className="w-2/4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={handleDeposit}
            >
              Deposit
            </button>
          </div>
          
        </div>
        <div className="mb-4">
          <label className="block mb-2">Withdraw Amount</label>
          <div className='flex gap-2 justify-between'>
          <div className="w-full   flex justify-between items-center">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
              className=" bg-[#393841] text-white p-4 rounded-[20px] w-full"
              step="0.01"
            />
            
          </div>
          <button 
              className=" w-2/4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </div>
        </div>
        {withdrawalStatus && (
          <div className={`mb-4 p-2 rounded ${
            withdrawalStatus === 'success' ? 'bg-green-500' :
            withdrawalStatus === 'error' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}>
            {withdrawalStatus === 'success' && 'Withdrawal successful!'}
            {withdrawalStatus === 'error' && 'Withdrawal failed. Please try again.'}
            {withdrawalStatus === 'pending' && 'Processing withdrawal...'}
          </div>
        )} 
        <div className="mb-4">
          <label className="block mb-2">Bet Amount: ${typeof betAmount === 'number' ? betAmount.toFixed(2) : '0.00'}</label>
          <div className='flex gap-2 justify-between'>
          <div className=" w-full   flex justify-between items-center">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
              className="bg-[#393841] text-white p-4 rounded-[20px] w-full"
              step="0.01"
            />
            
          </div>
          <div className='flex w-2/4 gap-1'>
          <button className="w-full bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={() => setBetAmount(prevBet => prevBet / 2)}>½</button>
          <button className="w-full bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
               onClick={() => setBetAmount(prevBet => prevBet * 2)}>2x</button>
          </div>
          </div>
        </div>
        <div className="mb-4 flex w-full justify-between">
          <div>
            <label className="block mb-2">Mines</label>
            <div></div>
            <input
              type="number"
              value={mines}
              onChange={(e) => setMines(Number(e.target.value))}
             className="bg-[#393841] text-white p-4 rounded-[20px] w-full   flex justify-between items-center"
              min="1"
              max="24"
            />
          </div>
          <div className=' flex flex-col justify-end items-end '>
            <label className="block mb-2 text-end">Gems</label>
            <input
              type="number"
              value={gems}
              className="bg-[#393841] text-white p-4 rounded-[20px] w-2/4   flex justify-between items-center"

              disabled
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Total profit ({currentMultiplier.toFixed(2)}x)</label>
          <input
            type="text"
            value={`$${potentialWin.toFixed(2)}`}
            className="bg-[#393841] text-white p-4 rounded-[20px] w-full  flex justify-between items-center"

            disabled
          />
        </div>
        <div className='flex w-full gap-3'>
        <button
          onClick={pickRandomTile}
          className="w-full cursor-pointer bg-[#2E262D] text-white hover: p-2 pt-4 pb-4 rounded-[19px]  mb-4 hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
          disabled={!gameStarted}
        >
          Pick random tile
        </button>
        <button
          onClick={handleBetCashout}
          className={`w-2/4 ${gameStarted ? 'bg-gradient-to-r cursor-pointer from-[#7831DA] to-[#FF1AF0]' : 'bg-[#2E262D]'}  text-white p-2 rounded-[19px] mb-4 hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200`}
          disabled={!gameStarted && betAmount > parseFloat(balance)}
        >
          {gameStarted ? 'Cashout' : 'Bet'}
        </button>
        </div>
      </div>
      <div className="relative bg-[#120916] rounded-r-[40px] w-2/3 flex items-start justify-center bg-[url('/images/bgFor btfd2 1.png')] bg-cover bg-center ">
      <div className='absolute z-30 w-[290px] font-semibold pt-7 '>
      <div className=" w-full">
         
          <div className='flex gap-2 justify-between'>
          <div className="bg-[#393841] text-white p-4 rounded-[20px] w-full  flex justify-between items-center">
            <span>${parseFloat(balance).toFixed(2)}</span>
            
          </div>
          <Dialog  open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button 
                  className="w-2/4 text-white px-4 py-2 rounded-[20px] cursor-pointer bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
                  onClick={() => setIsOpen(true)}
                >
                  Wallet
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] rounded-[25px] bg-[#0B090D] font-semibold">
                <DialogHeader>
                  <DialogTitle className='text-center text-xl'>Wallet</DialogTitle>
                  <button
                    className="absolute right-4 top-4 rounded-full p-2"
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                  >
                   
                    <span className="sr-only text-[#FF09E7] ">Close</span>
                  </button>
                </DialogHeader>
                <div className="mb-4">
          <label className="block mb-2">Balance</label>
          <div className='flex gap-2 justify-between'>
          <div className="bg-[#393841] text-white p-4 rounded-[20px] w-full  flex justify-between items-center">
            <span>${parseFloat(balance).toFixed(2)}</span>
            
          </div>
          <button 
              className="w-2/4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] cursor-pointer hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={handleCashOutAll}
              disabled={parseFloat(balance) <= 0}
            >
              Cash Out All
            </button>
            </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Deposit Amount</label>
            <div className='flex gap-2 justify-between'>
          <div className=" w-full flex justify-between items-center">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
              className=" bg-[#393841] text-white p-4 rounded-[20px] w-full"
              step="0.01"
            />
            
          </div>
          <button 
              className="w-2/4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={handleDeposit}
            >
              Deposit
            </button>
          </div>
          
        </div>
        <div className="mb-4">
          <label className="block mb-2">Withdraw Amount</label>
          <div className='flex gap-2 justify-between'>
          <div className="w-full   flex justify-between items-center">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
              className=" bg-[#393841] text-white p-4 rounded-[20px] w-full"
              step="0.01"
            />
            
          </div>
          <button 
              className=" w-2/4 bg-[#2E262D] text-white px-4 py-2 rounded-[20px] hover:bg-gradient-to-r from-[#7831DA] to-[#FF1AF0] transition duration-200"
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </div>
        </div>
        {withdrawalStatus && (
          <div className={`mb-4 p-2 rounded ${
            withdrawalStatus === 'success' ? 'bg-green-500' :
            withdrawalStatus === 'error' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}>
            {withdrawalStatus === 'success' && 'Withdrawal successful!'}
            {withdrawalStatus === 'error' && 'Withdrawal failed. Please try again.'}
            {withdrawalStatus === 'pending' && 'Processing withdrawal...'}
          </div>)}
              </DialogContent>
            </Dialog>
            </div>
            </div>
      </div>
      <div className='h-full w-full flex items-center justify-center'>
      <div className='absolute bottom-0 left-20 z-10'>
        <Image
        src='/images/memenoi 1.png'
        alt=''
        height={500}
        width={500}
        />
      </div>
      <div className='absolute bottom-0 right-0 z-10'>
        <Image
        src='/images/pookie 1.png'
        alt=''
        height={500}
        width={500}
        />
      </div>
      <div className='absolute opacity-35'>
        <Image
        src='/images/bgFor_btfd2_1.png'
        alt=''
        height={1500}
        width={1500}
        />
      </div>
        <div className="flex flex-col items-center z-20">
          {renderBoard()}
        </div>
      </div>
      </div>
    </div>
    <div className='bg-white/20 h-[200px]'>
        <div className='p-8'>Classic logic puzzle game where the goal is to clear a rectangular grid of hidden mines <br/>without detonating any</div>
    </div>
    </>
}
</>
  );
};

export default MinesGame;
