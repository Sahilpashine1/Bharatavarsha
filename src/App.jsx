import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import TimelinePage from './pages/TimelinePage';
import Characters from './pages/Characters';
import Battles from './pages/Battles';
import Maps from './pages/Maps';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminContent from './pages/AdminContent';
import Bloodlines from './pages/Bloodlines';
import Quiz from './pages/Quiz';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/battles" element={<Battles />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/bloodlines" element={<Bloodlines />} />
        <Route path="/quiz/:eraId" element={<Quiz />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/content/:type" element={<AdminContent />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
