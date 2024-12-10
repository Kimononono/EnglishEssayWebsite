import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReflectionPage from './ReflectionPage';

const AppTop = () => {
    return (
        <Router>
            <Routes>
                <Route path="EnglishEssayWebsite/reflection" element={<ReflectionPage />} />
                <Route path="EnglishEssayWebsite/" element={<App />} />
            </Routes>
        </Router>
    );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppTop />
  </StrictMode>,
)
