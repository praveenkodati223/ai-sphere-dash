
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sphere-purple to-sphere-cyan animate-pulse-slow"></div>
          <h1 className="text-2xl font-bold">
            <span className="text-gradient">Sphere</span> AI
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
          <a href="#dashboard" className="text-slate-300 hover:text-white transition">Dashboard</a>
          <a href="#ai" className="text-slate-300 hover:text-white transition">AI Insights</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden md:flex border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
            Login
          </Button>
          <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
