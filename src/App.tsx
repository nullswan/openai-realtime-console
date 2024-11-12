import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConsolePage } from './pages/ConsolePage';
import ProfilePage from './pages/profile';
import LearningPage from './pages/learning';
import Roadmap from './pages/roadmap';
import TellMeMore from './pages/tell-me-more';
import './App.scss';
import WhatToLearn from './pages/what-to-learn';

function App() {
  return (
    <div data-component="App">
      <Router>
        <Routes>
          <Route path="/" element={<TellMeMore />} />
          <Route path="/console" element={<ConsolePage />} />
          <Route path="/learning/:subject/:priority" element={<LearningPage />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/tell-me-more" element={<TellMeMore />} />
          <Route path="/what-to-learn" element={<WhatToLearn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;