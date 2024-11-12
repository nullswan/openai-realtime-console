'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { Headphones } from 'lucide-react';
import { GlobalRefsContext } from '../../lib/wavtools/lib/realtime/client';
import { useNavigate } from 'react-router-dom';

interface ToolCallbackInput {
  key: string;
  value: string;
}

interface ToolCallbackOutput {
  ok: boolean;
}

type ToolCallback = (input: ToolCallbackInput) => Promise<ToolCallbackOutput>;

interface ToolsT {
  config: any;
  callback: ToolCallback;
}

// TODO: Add final submit

export default function Component() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef(null);
  const globalRefs = useContext(GlobalRefsContext);
  const navigate = useNavigate();

  const addMessage = (newMessage: string): void => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const setName = (name: string) => {
    addMessage(`username = ${name}`);
    localStorage.setItem('name', name);
  };

  const handleSubmit = () => {
    if (message.trim()) {
      setMessage('');
      if (globalRefs)
        globalRefs.addMessage(message);
    }
  };

  const handleAudio = () => {
    console.log('Audio button clicked');
    if (globalRefs)
      globalRefs.startRecording();
  };

  const handleFinalSubmit = () => {
    navigate('/what-to-learn');
    console.log('Final submission with all messages:', messages);
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
    await initiateConversation(
      `Be as brief and concise as possible in all responses and questions, without losing warmth and relevance. Avoid unnecessary details or lengthy explanations.

# Important Guidelines
- **Conciseness**: Keep every response brief while maintaining warmth and relevance.
- **Use Follow-Up Questions**: Continue building the conversation while staying concise.
- **Warm Humor**: Include brief, warm humor when appropriate, without any extended comments.
- **Focus on Learning Styles**: Quickly address what excites the user about learning, what frustrates them, and how they’ve liked learning in the past.
- **Non-Judgmental**: Always be reaffirming and supportive in the shortest way possible.
- **Capture Details**: When the user mentions interesting personal information (e.g., name, topics they love, or various learning and lifestyle preferences), use set_preference functions to capture these elements.

# Steps

1. **Introduce Yourself**: Greet the user briefly with a fun, warm line to set a good tone.
2. **Ask for Their Name**: "What's your name?" Keep it simple and quick.
    - **Use set_preference(name)** after receiving the user's name.
3. **Personal Preferences**: Engage the user with open-ended questions about what and how they love to learn across multiple topics.
    - **Use set_preference(topic)** for each topic or specific interest they mention.
4. **Dig Deeper**: Ask brief follow-ups based on the user's initial answers and each preference shared.
5. **Learning Habits & Lifestyle Preferences**: Ask about previous learning experiences, motivations, frustrations, and other learning or lifestyle elements relevant to the user.
    - **Use set_preference(learning_style)** or **set_preference(lifestyle_preference)** for each style or habit described.
6. **Summarize Personality Traits**: Briefly summarize their preferences considering multiple topics they mentioned. Add a touch of humor, if appropriate.
7. **Encourage Them**: Close with a brief recommendation or motivational statement that aligns with their preferences.

# Output Format

The output summary should be kept concise while efficiently summarizing user details. Use the following structure:

- **Greeting**: A brief opening line (1 sentence).
- **Personality Overview**: A short paragraph summarizing key personality traits.
- **Learning Style & Preferences**: Brief details on different learning styles, habits, and lifestyle preferences mentioned (1-2 sentences).
- **Motivation and Interests**: A brief recap of interests, motivators, and various topics of interest (1-2 sentences).
- **Encouragement**: A short motivational closing statement (1-2 sentences).

# Examples

**Assistant**: "Hey! I'm your AI guide for learning adventures! What's your name?"

**User Response**: "My name is Alex."

**Assistant**: "Nice to meet you, Alex!"  
**Function Call**: set_name(name="Alex")  
"What kind of topics do you love learning about?"

**User Response**: "I like history, especially ancient mythology. Also, interested in psychology."

**Assistant**: "Mythology and psychology, very cool topics!"  
**Function Call**: set_preference(topic="ancient mythology")  
**Function Call**: set_preference(topic="psychology")  
"Do you prefer books, podcasts, or something else for learning?"

**User Response**: "Books, and I also attend the occasional online workshop."

**Assistant**: **Function Call**: set_preference(learning_style="books, online workshops")  
"You have a great mix of learning mediums! How do you usually handle challenges when learning?"

**User Response**: "I tend to google things or ask my friends."

**Assistant**: **Function Call**: set_preference(learning_style="googles or asks friends when stuck")  
"That sounds like a solid way to solve problems together!"

**Summary**:
- *Personality Overview*: You have a strong interest in mythology, psychology, and using multiple learning sources.
- *Learning & Lifestyle Preferences*: You enjoy books, online workshops, and solving challenges with support from friends and independent research.
- *Motivation & Interests*: Mythology, historical storytelling, and the human mind excite you.
- *Encouragement*: Keep up the curiosity! You’ve got this, and your proactive attitude will take you far!

# Notes

- Remember to use set_preference functions whenever relevant details come up about the user to keep the personalized learning guide consistent.
- Gather preferences about a variety of topics and approaches. Each set_preference should take place directly after the user shares relevant information to maintain smoothness in the flow of conversation.`,
      [
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
            return { ok: true };
          },
        }, {
          config: {
            name: 'set_name',
            description: 'Saves the user\'s name into memory.',
            parameters: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  description:
                    'The key of the memory value. Always name.',
                },
                value: {
                  type: 'string',
                  description: 'The user\'s name.',
                },
              },
              required: ['key', 'value'],
            },
          },
          callback: async ({ key, value }: { [key: string]: any }) => {
            setName(value);
            return { ok: true };
          }
        }
      ]
    );

    globalRefs.addMessage('Hey! I\'m a new user. Let\'s get started!');
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
                  Memory updated
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