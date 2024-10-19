"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import MinesGame from './MineGame' // Make sure this path is correct
import { X } from 'lucide-react'


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function GamesPage() {
  const [showMinesGame, setShowMinesGame] = useState(false)

  return (
    <div className="bg-gradient-to-b from-[#26073B] to-[#000000] min-h-screen text-white p-8">
      <h1 className="text-6xl font-bold text-center mb-12">Games</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#121212] rounded-lg overflow-hidden shadow-lg">
          <Image src="/images/mines-game.png" alt="Mines Game" width={400} height={300} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Mines</h2>
            <p className="text-gray-300 mb-4">Play the exciting Mines game and test your luck!</p>
            <button 
              onClick={() => setShowMinesGame(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Now
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showMinesGame} onOpenChange={setShowMinesGame}>
        <DialogContent className="max-w-full max-h-full w-full h-full p-0">
          <div className="relative w-full h-full">
            <button
              className="absolute right-4 top-4 z-10"
              variant="ghost"
              onClick={() => setShowMinesGame(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <MinesGame />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}