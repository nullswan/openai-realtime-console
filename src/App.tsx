import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConsolePage } from './pages/ConsolePage';
import LearningPage from './pages/learning';
import Roadmap from './pages/roadmap';
import TellMeMore from './pages/tell-me-more';
import './App.scss';
import WhatToLearn from './pages/what-to-learn';
import { GlobalRefsProvider } from './lib/wavtools/lib/realtime/client';

function App() {
  return (
    <div data-component="App">
      <GlobalRefsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<TellMeMore />} />
            <Route path="/console" element={<ConsolePage />} />
            <Route path="/learning/:subjectId/:priorityId" element={<LearningPage />} />
            <Route path="/roadmap/:subjectId" element={<Roadmap />} />
            <Route path="/tell-me-more" element={<TellMeMore />} />
            <Route path="/what-to-learn" element={<WhatToLearn />} />
          </Routes>
        </Router>
      </GlobalRefsProvider>
    </div>
  );
}

export default App;