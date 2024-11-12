'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Headphones } from 'lucide-react';

export default function Component() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const addMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    setMessages([]);
    const informations = JSON.parse(localStorage.getItem('informations') || '[]');
    for (const info of informations) {
      addMessage(info);
    }
  }, []);

  const handleSubmit = () => {
    if (message.trim()) {
      addMessage(message);
      setMessage('');

      // Add to the local storage, as an array of informations
      const informations = JSON.parse(localStorage.getItem('informations') || '[]');
      informations.push(message);
      localStorage.setItem('informations', JSON.stringify(informations));
      console.log(localStorage.getItem('informations'));
    }
  };

  const handleAudio = () => {
    // Simulating audio input
    const audioMessage = "Audio message placeholder";
    addMessage(audioMessage);
    console.log('Audio button clicked');
  };

  const handleFinalSubmit = () => {
    console.log('Final submission with all messages:', messages);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <div className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-lg font-semibold text-center">
                Tell me more about you
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm text-gray-500 text-right">
                  Mémoire mise à jour
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 break-words">
                  {msg}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Type your message.."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-6 py-4 pr-24 rounded-full bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 text-gray-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={handleSubmit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Submit message"
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

        {messages.length > 0 && (
          <div className="w-full flex items-center justify-center">
            <button
              onClick={handleFinalSubmit}
              className="w-fit px-6 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}