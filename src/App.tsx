import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import EditPage from './Components/EditPage';

const App: React.FC = () => {
  return (
    <Router basename="/BayesKnowledgeBaseApp">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </Router>
  );
};

export default App;
