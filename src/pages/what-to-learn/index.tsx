'use client';

import {
  ArrowUpCircle,
  ArrowUpRight,
  Flame,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../@/components/ui/button';
import { Input } from '../../@/components/ui/input';
import { ScrollArea, ScrollBar } from '../../@/components/ui/scroll-area';
import { getSuggestions } from '../../utils/get_suggestions';
import { getRoadmap } from '../../utils/get_roadmap';

// These types are assumed to be defined elsewhere in your project
type RoadmapResponse = {
  subject: string;
  tasks: { name: string }[];
};

type Suggestion = {
  subject: string;
};

export default function Component() {
  const name = localStorage.getItem('name') || 'learner';
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const informations = localStorage.getItem('informations');
      if (informations) {
        // Assuming getSuggestions is defined elsewhere
        const fetchedSuggestions = await getSuggestions(
          apiKey,
          informations.split('\n'),
          setSuggestions
        );
        setSuggestions(fetchedSuggestions);
      } else {
        setSuggestions([
          { subject: 'Generate a SaaS pricing calculator' },
          { subject: 'How can I structure LLM output?' },
          { subject: 'Calculate the factorial of a number' },
          { subject: 'Learn React hooks' },
          { subject: 'Build a REST API with Node.js' },
          { subject: 'Master CSS Grid layout' },
        ]);
      }
    };

    fetchSuggestions();
  }, [apiKey]);

  const handleEnterClick = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && event.currentTarget.value !== '') {
      setIsLoading(true);
      // Assuming getRoadmap is defined elsewhere
      const roadmap = await getRoadmap(
        apiKey,
        event.currentTarget.value,
        setRoadmap
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (inputValue) {
      setIsLoading(true);
      // Assuming getRoadmap is defined elsewhere
      const roadmap = await getRoadmap(apiKey, inputValue, setRoadmap);
      setIsLoading(false);
    }
  };

  const handleStartRoadmap = () => {
    if (roadmap) {
      navigate(`/roadmap/${encodeURIComponent(roadmap.subject)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Great {name}! What do you want to learn today?
          </h1>
          <p className="text-gray-600">
            Enter the competence you want to learn, I will generate an
            interactive roadmap that will help you reach that goal.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleEnterClick}
              placeholder="I want to learn about ..."
              className="w-full pr-14 h-12 text-lg rounded-full border-gray-200"
            />
            <Button
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              size="icon"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                <ArrowUpCircle className="w-5 h-5" />
              )}
              <span className="sr-only">Submit</span>
            </Button>
          </div>
          <div className="flex items-center justify-center w-full">
            <ScrollArea className="w-[43vw] whitespace-nowrap rounded-full">
              <div className="flex space-x-2 p-1 justify-center">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setInputValue(suggestion.subject)}
                    className="flex-shrink-0 rounded-full border-gray-200 text-xs py-1 px-3"
                  >
                    <span>{suggestion.subject}</span>
                    <ArrowUpRight className="w-3 h-3 ml-1 flex-shrink-0" />
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        {roadmap && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-xl font-semibold text-center">
              {roadmap.subject}
            </h2>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto pb-6 px-1 scrollbar-hide">
                {roadmap.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <span className="text-sm text-gray-400 font-mono">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-medium mb-auto font-mono opacity-0 animate-slide-up"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards',
                        }}
                      >
                        {task.name}
                      </h3>
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-200 rounded-full w-full transform origin-left transition-transform duration-1000"></div>
                        </div>
                      </div>
                    </div>
                    {/* {index < roadmap.tasks.length - 1 && (
                      <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 text-gray-300">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end">
                <ChevronRight className="w-8 h-8 text-gray-400 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleStartRoadmap}
                className="bg-black text-white rounded-full px-8 py-6 text-lg font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                Start Your Learning Journey
              </Button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
