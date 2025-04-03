
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      // This will be replaced with actual Supabase session check once integrated
      const savedUser = localStorage.getItem('sphere_user');
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
        }
      }
      
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock auth - will be replaced with Supabase
      const mockUser = {
        id: '123456',
        email,
        name: email.split('@')[0],
      };
      
      // Save to localStorage for demo purposes
      localStorage.setItem('sphere_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      toast.success('Signed in successfully!');
      
      return Promise.resolve();
    } catch (error) {
      toast.error('Failed to sign in');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock registration - will be replaced with Supabase
      const mockUser = {
        id: '123456',
        email,
        name,
      };
      
      // For demo, we'll just save to localStorage
      localStorage.setItem('sphere_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      toast.success('Account created successfully!');
      
      return Promise.resolve();
    } catch (error) {
      toast.error('Failed to create account');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Mock signout - will be replaced with Supabase
      localStorage.removeItem('sphere_user');
      setUser(null);
      toast.success('Signed out successfully');
      
      return Promise.resolve();
    } catch (error) {
      toast.error('Failed to sign out');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
