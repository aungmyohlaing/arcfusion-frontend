import Navbar from './components/Navbar'
import Upload from './pages/upload'
import Chat from './pages/chat'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'

export default function App() {  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);    
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex flex-col">
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  )
}