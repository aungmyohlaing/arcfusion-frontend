import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer dark:bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <img
            className="h-8 w-auto mb-4"
            src="/images/ArcFusion_logo.png"
            alt="ArcFusion Logo"
          />
          
          {/* Divider */}
          <div className="w-full border-t border-gray-700 my-4"></div>
          
          {/* Copyright */}
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} ArcFusion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 