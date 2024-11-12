import './index.css';
import { useNavigate } from 'react-router-dom';

function WhatToLearn() {
  const navigate = useNavigate();

  const handleEnterClick = () => {
    navigate('/roadmap');
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
            onClick={handleEnterClick}
          />
        </div>
      </div>
    </div>
  );
}

export default WhatToLearn;