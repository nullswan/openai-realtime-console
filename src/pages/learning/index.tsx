import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import { GlobalRefsContext } from '../../lib/wavtools/lib/realtime/client';
import { ToolsT } from '../../lib/wavtools/lib/realtime/event';

interface MessageT {
  role: 'user' | 'assistant';
  message: string;
}

function Learning() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageT[]>([]);
  const messagesEndRef = useRef(null);
  const globalRefs = useContext(GlobalRefsContext);
  const { subjectId, priorityId } = useParams();

  const addMessage = (msg: MessageT) => {
    setMessages((prev) => [...prev, msg]);
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
    await initiateConversation(`Learning about ${subjectId}`, []);

    globalRefs.addMessage('Learning about ' + subjectId);
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
        <div className="relative">
          <div className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-lg font-semibold text-center">
                {priorityId} - {subjectId}
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm text-gray-500 text-right">
                  Memory updated
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 break-words">
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