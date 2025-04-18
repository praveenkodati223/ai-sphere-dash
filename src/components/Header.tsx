
import React from 'react';
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <header className="bg-sphere-dark border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-sphere-purple to-sphere-cyan"></div>
              <h3 className="text-lg font-bold">
                <span className="text-gradient">Sphere</span> AI
              </h3>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-slate-400">
              <Link to="/analytics" className="hover:text-white transition">Analytics</Link>
              <Link to="/docs" className="hover:text-white transition">Docs</Link>
              <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
            </nav>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link 
              to="/app" 
              className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 px-4 py-2 rounded-md text-white"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
