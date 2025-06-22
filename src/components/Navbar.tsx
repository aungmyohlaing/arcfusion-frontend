import { Moon, Sun } from 'lucide-react';
import React from 'react';

const Navbar: React.FC<{ darkMode: boolean, toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {

  return (
    <nav className="bg-primary dark:bg-primary-dark shadow-md" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/images/ArcFusion_logo.png"
                alt="ArcFusion Logo"
                aria-label="ArcFusion application logo"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8" role="menubar">
              <a
                href="/"
                className="border-indigo-500 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                role="menuitem"
                aria-label="Navigate to home page"
              >
                Home
              </a>              
            </div>
            <div>
            <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Moon className="w-5 h-5" aria-hidden="true" /> : <Sun className="w-5 h-5" aria-hidden="true" />}
      </button>
            </div>
          </div>          
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 