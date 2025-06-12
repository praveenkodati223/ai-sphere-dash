
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DataImport from '../components/DataImport';
import { useNavigate } from 'react-router-dom';
import { useVisualization } from '@/contexts/VisualizationContext';
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const { activeDataset } = useVisualization();
  const navigate = useNavigate();
  
  const handleGoToAnalytics = () => {
    navigate('/analytics');
  };
  
  return (
    <div className="min-h-screen bg-sphere-dark">
      <Header />
      <Hero />
      
      {/* Main Sphere AI Dashboard Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gradient">Sphere AI</span> Dashboard
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Import your data and let AI-powered analytics transform your insights
            </p>
          </div>
          
          {/* Data Import Section */}
          <div className="max-w-4xl mx-auto">
            <DataImport />
            
            {/* Show Analytics Button if dataset is active */}
            {activeDataset && (
              <div className="mt-8 text-center">
                <div className="glass rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                    Dataset Ready: {activeDataset.name}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    {activeDataset.description} ({activeDataset.data.length} rows)
                  </p>
                  <Button 
                    onClick={handleGoToAnalytics}
                    className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 flex items-center gap-2 mx-auto"
                    size="lg"
                  >
                    <BarChart3 className="h-5 w-5" />
                    Open Analytics Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
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
