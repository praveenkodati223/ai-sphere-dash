
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-sphere-purple/20 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-sphere-cyan/20 to-transparent blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-1">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Visualize Your Data with <span className="text-gradient">AI-Powered</span> Insights
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Sphere AI transforms your raw data into meaningful insights. Upload your datasets, explore with intuitive visualizations, or simply ask our AI to analyze your data for you.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 px-8 py-6 text-lg">
              Start Visualizing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="glass p-4 rounded-2xl shadow-2xl shadow-sphere-purple/10 border border-white/10 overflow-hidden max-w-5xl mx-auto">
          <div className="aspect-video relative bg-sphere-dark rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl text-slate-300">Interactive Dashboard Preview</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-sphere-dark to-transparent"></div>
            <div className="absolute top-4 left-4 right-4 h-8 flex items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto glass-light px-4 py-1 rounded-full text-xs">
                sphere-ai.dashboard/analytics
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass p-6 animate-float" style={{ animationDelay: "0s" }}>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-sphere-purple to-sphere-cyan mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Visualizations</h3>
            <p className="text-slate-300">Create stunning charts and graphs with just a few clicks. Choose from bar, line, pie charts and more.</p>
          </div>
          
          <div className="glass p-6 animate-float" style={{ animationDelay: "0.2s" }}>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-sphere-purple to-sphere-cyan mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-slate-300">Let our AI analyze your data and suggest the best visualizations. Ask questions in plain English.</p>
          </div>
          
          <div className="glass p-6 animate-float" style={{ animationDelay: "0.4s" }}>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-sphere-purple to-sphere-cyan mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Data Import</h3>
            <p className="text-slate-300">Import data from CSV, Excel, or connect to databases. Automatically detect data types and relationships.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
