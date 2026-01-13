import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Accueil from './components/Accueil';
import ObjectifsPage from './components/Objectifs';
import DebriefingPage from './components/Debriefing';
import HistoriquePage from './components/Historique';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        
        <main className="pt-16">
          <Routes>
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/objectifs" element={<ObjectifsPage />} />
            <Route path="/debriefing" element={<DebriefingPage />} />
            <Route path="/historique" element={<HistoriquePage />} />
            <Route path="/" element={<Navigate to="/accueil" replace />} />
            <Route path="*" element={<Navigate to="/accueil" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;