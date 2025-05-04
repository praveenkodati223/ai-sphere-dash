
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, LineChart, PieChart, Table, Upload, Sparkles, FileSpreadsheet } from "lucide-react";
import ChartComponent from "./ChartComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleStartVisualize = () => {
    navigate('/analytics');
  };
  
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
            <Button 
              className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 px-8 py-6 text-lg"
              onClick={handleStartVisualize}
            >
              Start Visualizing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 px-8 py-6 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="glass p-4 rounded-2xl shadow-2xl shadow-sphere-purple/10 border border-white/10 overflow-hidden max-w-5xl mx-auto">
          <div className="aspect-video relative bg-sphere-dark rounded-xl overflow-hidden">
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
            
            {/* Interactive Dashboard Preview Content */}
            <div className="mt-12 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="text-cyan-400 h-5 w-5" />
                  Sphere AI Dashboard
                </h3>
                <div className="flex gap-2">
                  <Tabs defaultValue="charts" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="charts" className="text-xs">Charts</TabsTrigger>
                      <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
                      <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="glass p-3 rounded-lg col-span-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-white">Data Types</h4>
                    <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">CSV Files</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Excel</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Database</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">API</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-3 rounded-lg col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-white">Visualization Types</h4>
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Bar Charts</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Line Charts</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Pie Charts</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Area Charts</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Scatter Plots</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-300">Radar Charts</span>
                      <span className="text-xs font-medium text-white">✓</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="glass p-3 rounded-lg">
                  <div className="h-[90px] flex items-center justify-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                        <LineChart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">AI-Powered Analysis</h5>
                        <p className="text-xs text-slate-300 mt-1">Automated insights and pattern detection</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="h-[90px] flex items-center justify-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">Easy Data Import</h5>
                        <p className="text-xs text-slate-300 mt-1">Drag & drop any data source</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-sphere-dark to-transparent"></div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass p-6 animate-float" style={{ animationDelay: "0s" }}>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-sphere-purple to-sphere-cyan mb-4 flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Visualizations</h3>
            <p className="text-slate-300">Create stunning charts and graphs with just a few clicks. Choose from bar, line, pie charts and more.</p>
          </div>
          
          <div className="glass p-6 animate-float" style={{ animationDelay: "0.2s" }}>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-sphere-purple to-sphere-cyan mb-4 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-slate-300">Let our AI analyze your data and suggest the best visualizations. Ask questions in plain English.</p>
          </div>
          
          <div className="glass p-6 animate-float" style={{ animationDelay: "0.4s" }}>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-sphere-purple to-sphere-cyan mb-4 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6" />
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
