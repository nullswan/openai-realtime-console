import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConsolePage } from './pages/ConsolePage';
import LearningPage from './pages/learning';
import Roadmap from './pages/roadmap';
import TellMeMore from './pages/tell-me-more';
import './App.scss';
import WhatToLearn from './pages/what-to-learn';
import SearchPage from './pages/search';
import { GlobalRefsProvider } from './lib/wavtools/lib/realtime/client';
import ProfilePage from './pages/profile';
import Discover from './pages/discover';
import G from './pages/g';

function RedirectBasedOnStorage() {
  return localStorage.getItem('informations') ? <Navigate to="/search" /> : <Navigate to="/tell-me-more" />;
}

function App() {
  return (
    <div data-component="App">
      <GlobalRefsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RedirectBasedOnStorage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/tell-me-more" element={<TellMeMore />} />
            <Route path="/what-to-learn" element={<WhatToLearn />} />
            <Route path="/discover/:subjectId" element={<Discover />} />
            <Route path="/g/:subjectId" element={<G />} />
            {/* Legacy components */}
            <Route path="/console" element={<ConsolePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/learning/:subjectId/:priorityId" element={<LearningPage />} />
            <Route path="/roadmap/:subjectId" element={<Roadmap />} />
          </Routes>
        </Router>
      </GlobalRefsProvider>
    </div>
  );
}

export default App;