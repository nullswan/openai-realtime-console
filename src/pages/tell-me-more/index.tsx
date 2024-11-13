'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { BookOpenIcon, Headphones } from 'lucide-react';
import { GlobalRefsContext } from '../../lib/wavtools/lib/realtime/client';
import { useNavigate } from 'react-router-dom';
import { ToolsT } from '../../lib/wavtools/lib/realtime/event';
import { tellMorePrompt } from './prompt';

const maxMessages = 5;

export default function TellMeMore() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef(null);
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
    console.log('Messages:', messages);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="relative transition-all duration-500">
          <div className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-lg font-semibold text-center">
                Tell me more about you
              </div>
            )}
            {messages.slice(-maxMessages).map((msg, index) => (
              <div
                key={index}
                className="flex flex-col items-end space-y-2 animate-fade-in"
              >
                <div className="flex items-center space-x-2 bg-white-100 text-gray-600 text-sm p-2 rounded-3xl">
                  <BookOpenIcon className="w-4 h-4" />
                  <span>Memory updated</span>
                </div>
                <div className="bg-gray-50 rounded-3xl p-4 break-words w-full max-w-md text-right">
                  {msg}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`
              transition-all duration-700 ease-in-out transform
              ${
                isFirstMessage
                  ? 'relative'
                  : 'fixed bottom-0 left-0 right-0 max-w-2xl mx-auto px-4 pb-6 bg-white'
              }
            `}
          >
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
            <div className={`absolute flex items-center gap-1 ${!isFirstMessage ? "top-[35%] -translate-y-1/2 right-6" : "right-2 top-1/2 -translate-y-1/2"}`}>
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

        {messages.length > 0 && localStorage.getItem('name') && (
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
