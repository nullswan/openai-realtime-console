'use client'

import { useState } from 'react'
import { ArrowUp, Headphones } from 'lucide-react'

export default function Component() {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    console.log('Message submitted:', message)
  }

  const handleAudio = () => {
    console.log('Audio button clicked')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Tell me more about you
        </h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="I am Ethan! I love X, I am Y, I am interested in Z.."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-6 py-4 pr-24 rounded-full bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 text-gray-900"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button 
              onClick={handleSubmit}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Submit"
            >
              <ArrowUp className="w-6 h-6 text-black" />
            </button>
            <button 
              onClick={handleAudio}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Audio input"
            >
              <Headphones className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}