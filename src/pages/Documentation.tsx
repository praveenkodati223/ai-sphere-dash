
import React from 'react';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, PlayCircle, Lightbulb } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-sphere-dark">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Sphere AI <span className="text-gradient">Documentation</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Everything you need to know about using Sphere AI for data visualization and analytics
              </p>
            </div>
            
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="getting-started" className="flex gap-2 items-center">
                  <BookOpen className="h-4 w-4" />
                  <span>Getting Started</span>
                </TabsTrigger>
                <TabsTrigger value="tutorials" className="flex gap-2 items-center">
                  <PlayCircle className="h-4 w-4" />
                  <span>Tutorials</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex gap-2 items-center">
                  <Code className="h-4 w-4" />
                  <span>API Reference</span>
                </TabsTrigger>
                <TabsTrigger value="examples" className="flex gap-2 items-center">
                  <Lightbulb className="h-4 w-4" />
                  <span>Examples</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="getting-started" className="mt-0">
                <div className="space-y-8">
                  <div className="glass p-6">
                    <h2 className="text-2xl font-semibold mb-4">Introduction to Sphere AI</h2>
                    <p className="mb-4 text-slate-300">
                      Sphere AI is a powerful data visualization platform that helps you transform raw data 
                      into meaningful insights. With an intuitive interface and AI-powered analysis, 
                      Sphere AI makes it easy to create stunning visualizations and discover patterns in your data.
                    </p>
                    <p className="mb-6 text-slate-300">
                      Whether you're a data scientist, business analyst, or marketer, Sphere AI provides the 
                      tools you need to make data-driven decisions with confidence.
                    </p>
                    <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
                      Quick Start Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Importing Data",
                        description: "Learn how to import data from various sources, including CSV, Excel, and databases."
                      },
                      {
                        title: "Creating Visualizations",
                        description: "Discover how to create charts, graphs, and other visualizations with a few clicks."
                      },
                      {
                        title: "Using AI Features",
                        description: "See how AI can help you analyze data and generate insights automatically."
                      }
                    ].map((item, index) => (
                      <div key={index} className="glass p-6">
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-slate-300 mb-4">{item.description}</p>
                        <Button variant="link" className="text-sphere-cyan p-0">
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tutorials" className="mt-0">
                <div className="glass p-6">
                  <h2 className="text-2xl font-semibold mb-6">Video Tutorials</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-slate-800 border border-white/10 rounded-lg overflow-hidden">
                        <div className="h-48 bg-gradient-to-tr from-sphere-purple/20 to-sphere-cyan/20 flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-white opacity-80" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-1">Tutorial {item}: Advanced Data Visualization</h4>
                          <p className="text-sm text-slate-400 mb-3">Learn how to create interactive dashboards with Sphere AI</p>
                          <div className="flex items-center text-xs text-slate-500">
                            <span>12:34</span>
                            <span className="mx-2">•</span>
                            <span>1.2K views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="api" className="mt-0">
                <div className="glass p-6">
                  <h2 className="text-2xl font-semibold mb-6">API Reference</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <div className="p-4 bg-slate-800 border-b border-white/10">
                        <h3 className="font-medium">Authentication</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-slate-300 mb-4">
                          Learn how to authenticate with the Sphere AI API using API keys.
                        </p>
                        <div className="bg-slate-900 p-3 rounded-md">
                          <code className="text-sphere-cyan text-sm">
                            curl -X POST https://api.sphere-ai.com/v1/auth \<br />
                            &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                            &nbsp;&nbsp;-d '{JSON.stringify({apiKey: "YOUR_API_KEY"})}'
                          </code>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <div className="p-4 bg-slate-800 border-b border-white/10">
                        <h3 className="font-medium">Endpoints</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {[
                            {
                              method: "GET",
                              endpoint: "/v1/datasets",
                              description: "List all datasets"
                            },
                            {
                              method: "POST",
                              endpoint: "/v1/visualizations",
                              description: "Create a new visualization"
                            },
                            {
                              method: "GET",
                              endpoint: "/v1/insights",
                              description: "Get AI-generated insights"
                            }
                          ].map((item, index) => (
                            <div key={index} className="flex">
                              <div className="w-16 text-xs font-semibold px-2 py-1 rounded-md bg-sphere-purple/20 text-sphere-purple text-center">
                                {item.method}
                              </div>
                              <div className="ml-3">
                                <div className="font-mono text-sm">{item.endpoint}</div>
                                <div className="text-sm text-slate-400">{item.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-0">
                <div className="glass p-6">
                  <h2 className="text-2xl font-semibold mb-6">Example Projects</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Sales Dashboard",
                        description: "Track sales performance across regions and product categories."
                      },
                      {
                        title: "Marketing ROI",
                        description: "Analyze the return on investment for different marketing channels."
                      },
                      {
                        title: "Customer Segmentation",
                        description: "Segment customers based on behavior and preferences."
                      },
                      {
                        title: "Supply Chain Analytics",
                        description: "Optimize inventory and shipping with real-time analytics."
                      },
                      {
                        title: "Social Media Performance",
                        description: "Track engagement and reach across social media platforms."
                      },
                      {
                        title: "Financial Forecasting",
                        description: "Predict future financial performance with AI-powered models."
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-slate-800 border border-white/10 rounded-lg p-5">
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                        <Button variant="outline" size="sm" className="w-full border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
                          View Example
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Sphere AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;
