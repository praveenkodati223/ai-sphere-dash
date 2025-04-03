
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sphere-purple to-sphere-cyan animate-pulse-slow"></div>
            <h1 className="text-2xl font-bold">
              <span className="text-gradient">Sphere</span> AI
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-slate-300 hover:text-white">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[
                      {
                        title: "Data Visualization",
                        href: "/#dashboard",
                        description: "Create stunning visualizations from your data"
                      },
                      {
                        title: "AI-Powered Analysis",
                        href: "/analytics",
                        description: "Get automated insights with our advanced AI"
                      },
                      {
                        title: "Dashboard Builder",
                        href: "/#dashboard",
                        description: "Build custom dashboards for your team"
                      },
                      {
                        title: "Data Integration",
                        href: "/#dashboard",
                        description: "Connect to various data sources seamlessly"
                      }
                    ].map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/analytics" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
                  Analytics
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/docs" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
                  Documentation
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/profile">
            <Button variant="outline" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
              Profile
            </Button>
          </Link>
          <Button className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
            Get Started
          </Button>
        </div>
        
        <button 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 border-t border-white/10 mt-4">
          <Link 
            to="/" 
            className="block py-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/analytics" 
            className="block py-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link 
            to="/docs" 
            className="block py-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Documentation
          </Link>
          <Link 
            to="/pricing" 
            className="block py-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/profile" 
            className="block py-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <div className="pt-2 border-t border-white/10">
            <Button className="w-full bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
