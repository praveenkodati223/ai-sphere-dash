
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useVisualization } from '@/contexts/VisualizationContext';

const Index = () => {
  const { importCustomData, activeDataset } = useVisualization();
  const navigate = useNavigate();
  
  // Auto import custom data for demonstration purposes only if no active dataset
  useEffect(() => {
    // Only import data if there's no active dataset
    if (!activeDataset) {
      // Import a custom dataset with a recognizable name
      importCustomData('Demo Dashboard Data', 'This dataset is auto-loaded for demonstration purposes');
    }
  }, [importCustomData, activeDataset]);
  
  return (
    <div className="min-h-screen bg-sphere-dark">
      <Header />
      <Hero />
      <Dashboard />
      
      <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-sphere-purple to-sphere-cyan"></div>
            <h3 className="text-xl font-bold">
              <span className="text-gradient">Sphere</span> AI
            </h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            The next generation data visualization platform with AI-powered insights
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition" onClick={(e) => {
              e.preventDefault();
              navigate('/docs');
            }}>Privacy Policy</a>
            <a href="#" className="hover:text-white transition" onClick={(e) => {
              e.preventDefault();
              navigate('/docs');
            }}>Terms of Service</a>
            <a href="#" className="hover:text-white transition" onClick={(e) => {
              e.preventDefault();
              navigate('/docs');
            }}>Contact</a>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Sphere AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
