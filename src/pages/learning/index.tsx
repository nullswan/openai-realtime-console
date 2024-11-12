import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import { GlobalRefsContext } from '../../lib/wavtools/lib/realtime/client';
import { ToolsT } from '../../lib/wavtools/lib/realtime/event';
import { learningPrompt } from './prompt';

interface MessageT {
  role: 'user' | 'assistant';
  message: string;
}

interface KeyConcepts {
  name: string;
  isLearned: boolean;
  description: string;
}

interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: KeyConcepts[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: string;
}

interface Subject {
  subject: string;
  tasks: Task[];
}

// TODO: Set Priority to done @Alexis
// TODO: Show some confetti before redirecting
// TODO: Use links for hints
function Learning() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageT[]>([]);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const globalRefs = useContext(GlobalRefsContext);
  const { subjectId, priorityId } = useParams();
  const navigate = useNavigate();

  const addMessage = (msg: MessageT) => {
    setMessages((prev) => [...prev, msg]);
  };

  const setPriority = (subject: string, priority: number, status: 'Done' | 'In Progress') => {
    const subjectData = JSON.parse(localStorage.getItem(subject) || '[]');
    const updatedData = subjectData.map((item: Task) => 
      item.priority === priority ? { ...item, progress: status } : item
    );
    localStorage.setItem(subject, JSON.stringify(updatedData));
  };

  useEffect(() => {
    console.log('Messages:', messages);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAudio = () => {
    console.log('Audio button clicked');
    if (globalRefs)
      globalRefs.startRecording();
  };

  const handleSubmit = () => {
    if (message.trim()) {
      setMessage('');
      addMessage({ role: 'user', message });
      if (globalRefs)
        globalRefs.addMessage(message);
    }
  };

  const initiateConversation = async (
    instructions: string,
    tools: ToolsT[],
  ) => {
    if (globalRefs) {
      await globalRefs.connectConversation(instructions, tools);
    }
  };

  const startCallback = async () => {
    await initiateConversation(learningPrompt(subjectId), [
      {
        config: {
          name: 'next_question',
          description: 'Provide the next question to ask the user',
          parameters: {
            type: 'object',
            properties: {
              subject: {
                type: 'string',
                description: 'The question being asked to the user',
              }
            }
          }
        },
        callback: async ({ subject }) => {
          console.log('Next question:', subject);
          addMessage({ role: 'assistant', message: subject });
        }
      },
      {
        config: {
          name: 'answer_validation',
          description: 'Validate the user answer',
          parameters: {
            type: 'object',
            properties: {
              validation: {
                type: 'boolean',
                description: 'Whether the answer is correct or not'
              },
            }
          }
        },
        callback: async ({ validation }) => {
          console.log('Answer validation:', validation, message);
          addMessage({ role: 'assistant', message: validation ? 'Correct!' : 'Incorrect!\n' });
          if (validation)
            setProgress((prev) => prev + 25);
        }
      },
      {
        config: {
          name: 'question_hint',
          description: 'Provide a hint to the user',
          parameters: {
            type: 'object',
            properties: {
              hint: {
                type: 'string',
                description: 'The hint to provide to the user'
              }
            }
          }
        },
        callback: async ({ hint }) => {
          console.log('Hint:', hint);
          addMessage({
            role: 'assistant', message: hint + '\nhttps://www.perplexity.ai/search/new?q=' + hint
          });
        }
      }
    ]);

    globalRefs.addMessage('Give the first question to the user');
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
    if (progress === 100) {
      navigate('/roadmap/' + subjectId);
    }
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <div className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-lg font-semibold text-center">
                {priorityId} - {subjectId}
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className="text-sm text-gray-500">
                  {msg.role === 'user' ? 'User' : 'Assistant'}
                </div>
                <div className={`bg-gray-50 rounded-2xl p-4 break-words ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  {msg.message}
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
    </div>
  );
}
export default Learning;