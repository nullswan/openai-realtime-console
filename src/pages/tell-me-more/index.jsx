import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function TellMeMore() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleMicClick = () => {
    console.log('Microphone clicked');
  };

  const handleOkClick = () => {
    navigate('/what-to-learn');
  };

  return (
    <div data-component='TellMeMorePage'>
      <div className='content-top'>
        <div className='content-title'>
          <h1>Tell Me More About You</h1>
        </div>
      </div>
      <div className='content-main'>
        <div className='content-block'>
          <div className='input-container'>
            <input
              type='text'
              placeholder='Tell me anything about you...'
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={handleMicClick}
            />
            <button className='mic-button' onClick={handleMicClick}>
              🎤
            </button>
          </div>
          <button className='ok-button' onClick={handleOkClick}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default TellMeMore;