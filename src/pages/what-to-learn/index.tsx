'use client';

import { ArrowUpCircle, ArrowUpRight, Flame } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../../@/components/ui/button';
import { Input } from '../../@/components/ui/input';
import { ScrollArea, ScrollBar } from '../../@/components/ui/scroll-area';
import { RoadmapResponse, Suggestion } from '../../lib/types';
import { getRoadmap } from '../../utils/get_roadmap';
import { getSuggestions } from '../../utils/get_suggestions';

export default function Component() {
  const name = localStorage.getItem('name') || 'learner';

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  //   { subject: 'Generate a SaaS pricing calculator' },
  //   { subject: 'How can I structure LLM output?' },
  //   { subject: 'Calculate the factorial of a number' },
  //   { subject: 'Learn React hooks' },
  //   { subject: 'Build a REST API with Node.js' },
  //   { subject: 'Master CSS Grid layout' },
  // ]);
  const [inputValue, setInputValue] = useState('');

  const suggestionsAsync = async () => {
    const informations = localStorage.getItem('informations');
    if (informations) {
      const suggestions = await getSuggestions(apiKey, informations.split('\n'), setSuggestions);
      setSuggestions(suggestions);
    }
    else {
      setSuggestions(
        [
          { subject: 'Generate a SaaS pricing calculator' },
          { subject: 'How can I structure LLM output?' },
          { subject: 'Calculate the factorial of a number' },
          { subject: 'Learn React hooks' },
          { subject: 'Build a REST API with Node.js' },
          { subject: 'Master CSS Grid layout' },
        ]
      );
    }
  };

  useEffect(() => {
    suggestionsAsync();
  }, []);

  const handleEnterClick = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value !== '') {
      const roadmap = await getRoadmap(apiKey, event.currentTarget.value, setRoadmap);
      console.log("Function returned:", roadmap);
    }
  };

  const handleSubmit = () => {
    if (inputValue) {
      console.log('Getting roadmap for:', inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-12">
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
          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleEnterClick}
              placeholder="I want to learn Machine Learning"
              className="w-full pr-14 h-12 text-lg rounded-full"
            />
            <Button
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              size="icon"
            >
              <ArrowUpCircle className="w-5 h-5" />
              <span className="sr-only">Submit</span>
            </Button>
          </div>

          <ScrollArea className="w-full whitespace-nowrap rounded-full">
            <div className="flex space-x-2 p-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setInputValue(suggestion.subject)}
                  className="flex-shrink-0 rounded-full"
                >
                  <span className="text-sm">{suggestion.subject}</span>
                  <ArrowUpRight className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {roadmap && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{roadmap.subject}</h2>
            <div className="grid gap-4">
              {roadmap.tasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-6 space-y-4"
                >
                  <h3 className="text-lg font-medium">{task.name}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {task.key_concepts?.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                      >
                        {concept.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
