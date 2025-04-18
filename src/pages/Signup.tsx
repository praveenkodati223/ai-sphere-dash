
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(name, email, password);
      navigate('/app'); // Automatically redirect to app dashboard after signup
    } catch (error) {
      console.error(error);
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sphere-dark flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-8">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sphere-purple to-sphere-cyan mr-2"></div>
        <h1 className="text-2xl font-bold">
          <span className="text-gradient">Sphere</span> AI
        </h1>
      </div>
      
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/20 border-white/10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-sphere-cyan hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
