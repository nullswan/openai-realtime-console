import './index.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRoadmap } from '../../utils/get_roadmap';

interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: string[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: boolean;
}

interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

function WhatToLearn() {
  const navigate = useNavigate();
  const apiKey: string = process.env.REACT_APP_OPENAI_API_KEY || '';
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const handleEnterClick = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value !== '') {
      const roadmap = await getRoadmap(apiKey, event.currentTarget.value, setRoadmap);
      console.log(roadmap);
    }
  }

  useEffect(() => {
    console.log(roadmap);
  }, [roadmap]);

  const handlePrevTask = () => {
    setCurrentTaskIndex((prev) => (prev > 0 ? prev - 1 : roadmap?.tasks.length! - 1));
  };

  const handleNextTask = () => {
    setCurrentTaskIndex((prev) => (prev < roadmap?.tasks.length! - 1 ? prev + 1 : 0));
  };

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
        {roadmap && (
          <div className='content-block'>
            <h1>{roadmap?.subject}</h1>
            <div className='carousel'>
              <button onClick={handlePrevTask}>&lt;</button>
              <div className='task-card'>
                <h2>{roadmap?.tasks[currentTaskIndex].name}</h2>
                <p>{roadmap?.tasks[currentTaskIndex].description}</p>
                <div className='key-concepts'>
                  {roadmap?.tasks[currentTaskIndex]?.key_concepts?.map((concept, index) => (
                    <span key={index} className='concept-tag'>{concept}</span>
                  ))}
                </div>
                {roadmap?.tasks[currentTaskIndex]?.practical_applications && (
                  <p className='applications'>
                    <strong>Practical Applications:</strong> {roadmap?.tasks[currentTaskIndex]?.practical_applications}
                  </p>
                )}
              </div>
              <button onClick={handleNextTask}>&gt;</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatToLearn;