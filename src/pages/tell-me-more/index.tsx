'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { BookOpenIcon, Headphones } from 'lucide-react';
import { GlobalRefsContext } from '../../lib/wavtools/lib/realtime/client';
import { useNavigate } from 'react-router-dom';
import { ToolsT } from '../../lib/wavtools/lib/realtime/event';
import { tellMorePrompt } from './prompt';
import Header from '../../components/Header/Header';

const maxMessages = 5;

export default function TellMeMore() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const globalRefs = useContext(GlobalRefsContext);
  const navigate = useNavigate();
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  const addMessage = (newMessage: string): void => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      if (isFirstMessage) setIsFirstMessage(false);
      return updatedMessages;
    });
  };

  const addPreference = (key: string, value: string): void => {
    const preferences = JSON.parse(
      localStorage.getItem('informations') || '[]'
    );
    preferences.push({ key, value });
    localStorage.setItem('informations', JSON.stringify(preferences));
  };

  const setName = (name: string) => {
    addMessage(`username = ${name}`);
    localStorage.setItem('name', name);
  };

  const handleSubmit = () => {
    if (message.trim()) {
      setMessage('');
      if (globalRefs) globalRefs.addMessage(message);
    }
  };

  const handleAudio = () => {
    console.log('Audio button clicked');
    if (globalRefs) globalRefs.startRecording();
  };

  const handleFinalSubmit = () => {
    navigate('/');
    console.log('Final submission with all messages:', messages);
  };

  const initiateConversation = async (
    instructions: string,
    tools: ToolsT[]
  ) => {
    if (globalRefs) {
      await globalRefs.connectConversation(instructions, tools);
    }
  };

  const startCallback = async () => {
    await initiateConversation(tellMorePrompt, [
      {
        config: {
          name: 'set_memory',
          description: 'Saves important data about the user into memory.',
          parameters: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description:
                  'The key of the memory value. Always use lowercase and underscores, no other characters.',
              },
              value: {
                type: 'string',
                description: 'Value can be anything represented as a string',
              },
            },
            required: ['key', 'value'],
          },
        },
        callback: async ({ key, value }: { [key: string]: any }) => {
          addMessage(`${key} = ${value}`);
          addPreference(key, value);
          return { ok: true };
        },
      },
      {
        config: {
          name: 'set_name',
          description: "Saves the user's name into memory.",
          parameters: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'The key of the memory value. Always name.',
              },
              value: {
                type: 'string',
                description: "The user's name.",
              },
            },
            required: ['key', 'value'],
          },
        },
        callback: async ({ key, value }: { [key: string]: any }) => {
          setName(value);
          return { ok: true };
        },
      },
    ]);

    globalRefs.addMessage("Hey! I'm a new user. Let's get started!");
  };

  useEffect(() => {
    startCallback();
    return () => {
      if (globalRefs) {
        globalRefs.disconnectConversation();
      }
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (inputRef.current && !isFirstMessage) {
      inputRef.current.focus();
    }
  }, [messages, isFirstMessage]);

  return (
    <>
      <Header />
      <div className="w-full max-w-2xl mx-auto space-y-6 relative h-[70vh] bg-white">
        <div className="h-full flex flex-col w-screen items-center justify-center p-4 overflow-hidden">
          <div className="-translate-x-[28vw] -translate-y-10 space-y-6 mb-6 max-h-[calc(100%-80px)] overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-2xl font-semibold text-center text-gray-700 animate-fade-in">
                Tell me more about you
              </div>
            )}
            {messages.slice(-maxMessages).map((msg, index) => (
              <div
                key={index}
                className="flex flex-col items-end space-y-2 animate-slide-up"
              >
                <div className="flex items-center space-x-2 bg-white text-gray-600/20 font-semibold text-sm px-4 py-2 rounded-3xl shadow-sm">
                  <BookOpenIcon className="w-4 h-4" />
                  <span>Memory updated</span>
                </div>
                <div className="bg-gray-100 rounded-3xl px-4 py-2 break-words w-full max-w-md text-right">
                  {msg}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            className={`
            absolute left-0 right-0 mx-auto w-full max-w-md
            transition-all duration-1000 ease-in-out
            ${isFirstMessage ? 'top-1/2 -translate-y-1/2' : 'bottom-0'}
          `}
            style={{
              transform: isFirstMessage ? 'translateY(-50%)' : 'translateY(0)',
              transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-6 py-4 pr-24 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900 transition-all duration-300 ease-in-out shadow-md"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={handleAudio}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Audio input"
                >
                  <Headphones className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
