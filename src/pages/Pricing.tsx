
import React from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Basic features for individuals getting started",
      features: [
        "Up to 5 visualizations",
        "Basic chart types",
        "CSV & Excel import",
        "1GB storage",
        "Email support"
      ],
      recommended: false,
      buttonText: "Start Free"
    },
    {
      name: "Pro",
      price: "29",
      description: "Advanced features for professionals and small teams",
      features: [
        "Unlimited visualizations",
        "Advanced chart types",
        "Database connections",
        "10GB storage",
        "Priority support",
        "AI-powered insights",
        "Custom branding"
      ],
      recommended: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "99",
      description: "Everything you need for large teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Advanced security",
        "SAML SSO",
        "Dedicated account manager",
        "Custom integrations",
        "Training & onboarding"
      ],
      recommended: false,
      buttonText: "Contact Sales"
    }
  ];
  
  return (
    <div className="min-h-screen bg-sphere-dark">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg text-slate-300">
              Choose the plan that's right for you and start transforming your data into insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`glass p-8 rounded-2xl relative ${
                  plan.recommended ? 'border-2 border-sphere-cyan' : 'border border-white/10'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-sphere-purple to-sphere-cyan px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-300 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-sphere-cyan shrink-0 mt-0.5 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.recommended 
                      ? 'bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="glass p-8 rounded-2xl max-w-4xl mx-auto mt-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-2">Need a custom solution?</h3>
                <p className="text-slate-300">
                  Our team can help you design a custom plan that meets your specific requirements.
                  Contact us to discuss your needs and get a personalized quote.
                </p>
              </div>
              <div className="md:w-1/3 text-center">
                <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
                  Contact Sales
                </Button>
              </div>
            </div>
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

export default Pricing;
