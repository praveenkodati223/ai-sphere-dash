
import React from 'react';
import Dashboard from '../components/Dashboard';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-sphere-dark">
      {/* Header with back button */}
      <div className="border-b border-white/10 bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sphere AI
              </Button>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-sphere-purple to-sphere-cyan"></div>
                <h1 className="text-xl font-bold">
                  <span className="text-gradient">Analytics</span> Dashboard
                </h1>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
            >
              <Home className="h-4 w-4 mr-2" />
              Main Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      <Dashboard />
    </div>
  );
};

export default Analytics;
