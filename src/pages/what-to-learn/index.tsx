import './index.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRoadmap } from '../../utils/get_roadmap';
import { getSuggestions } from '../../utils/get_suggestions';

interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: string[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: string;
}

interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

interface Suggestion {
  subject: string;
}

function WhatToLearn() {
  const apiKey: string = process.env.REACT_APP_OPENAI_API_KEY || '';
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);


  const getSuggestionsAsync = async (informations: string[]) => {
    const suggestions = await getSuggestions(apiKey, informations, setSuggestions);
    setSuggestions(suggestions);
  }


  useEffect(() => {
    const informations = JSON.parse(localStorage.getItem('informations') || '[]');
    getSuggestionsAsync(informations);
  }, []);

  const handleEnterClick = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value !== '') {
      const roadmap = await getRoadmap(apiKey, event.currentTarget.value, setRoadmap);
    }
  }

  return (
    <div data-component='WhatToLearn'>
      <div className='content-top'>
        <div className='content-title'>
          <h1>What do you want to learn about today?</h1>
        </div>
      </div>
      <div className='content-main'>
        <div className='content-block'>
          <input
            type='text'
            placeholder='Enter text...'
            onKeyDown={async (event) => await handleEnterClick(event)}
          />
        </div>
        {suggestions.length > 0 && (
          <div className='content-block bg-purple-500'>
            <h1>Suggestions</h1>
            <div className='carousel-container'>
              {suggestions.map((suggestion, index) => (
                <div key={index} className='suggestion-card'>
                  <h2>{suggestion.subject}</h2>
                </div>
              ))}
            </div>
          </div>
        )}
        {roadmap && (
          <div className='content-block'>
            <h1>{roadmap.subject}</h1>
            <div className='carousel-container'>
              <div className='carousel'>
                {roadmap.tasks.map((task, index) => (
                  <div key={index} className='task-card'>
                    <h2>{task.name}</h2>
                    <p>{task.description}</p>
                    <div className='key-concepts'>
                      {task.key_concepts?.map((concept, index) => (
                        <span key={index} className='concept-tag'>{concept}</span>
                      ))}
                    </div>
                    {task.practical_applications && (
                      <p className='applications'>
                        <strong>Practical Applications:</strong> {task.practical_applications}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatToLearn;