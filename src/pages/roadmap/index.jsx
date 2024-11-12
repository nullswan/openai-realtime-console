import React from 'react';
import { useNavigate } from 'react-router-dom';

function Roadmap() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(redirectTo);
  };

  const chapters = [
    {
      name: 'Introduction',
      description: 'Get to know the basics.',
      hint: 'Start here if you are new.',
      redirectTo: '/learning/subject/1',
    },
    {
      name: 'Advanced Topics',
      description: 'Dive deeper into advanced concepts.',
      hint: 'Recommended for experienced users.',
      redirectTo: '/learning/subject/2',
    },
    {
      name: 'Expert Level',
      description: 'Master the subject with expert-level content.',
      hint: 'For those seeking mastery.',
      redirectTo: '/learning/subject/3',
    },
  ];

  return (
    <div className="chapters-list">
      {chapters.map((chapter, index) => (
        <Chapter
          key={index}
          name={chapter.name}
          description={chapter.description}
          hint={chapter.hint}
          redirectTo={chapter.redirectTo}
        />
      ))}
    </div>
  );
}

function Chapter({ name, description, hint, redirectTo }) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(redirectTo);
  };

  return (
    <div className="chapter">
      <h2 className="chapter-name">{name}</h2>
      <p className="chapter-description">{description}</p>
      <span className="chapter-hint">{hint}</span>
      <button className="start-button" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}

export default Roadmap;
