import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DataImport from './DataImport';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
