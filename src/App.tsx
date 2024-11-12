import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConsolePage } from './pages/ConsolePage';
import ProfilePage from './pages/profile';
import GettingStarted from './pages/getting-started';
import LearningPage from './pages/learning-page';
import './App.scss';

function App() {
  return (
    <div data-component="App">
      <Router>
        <Routes>
          <Route path="/" element={<GettingStarted />} />
          <Route path="/console" element={<ConsolePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/learning" element={<LearningPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;