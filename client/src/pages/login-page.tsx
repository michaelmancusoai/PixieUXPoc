import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Simple login page without complex animations
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Expected credentials
  const VALID_EMAIL = 'yeti@pixiedental.com';
  const VALID_PASSWORD = 'PlanetPixie';
  
  // Colors derived from the primary color #507286
  const COLORS = {
    primary: '#507286',  
    secondary: '#6A9CB1',
    light: '#C5D4DD',    
    dark: '#3A5363',     
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      toast({
        title: "Login Successful",
        description: "Welcome to Pixie Dental!",
        variant: "default",
      });
      
      setTimeout(() => {
        setLocation('/dashboard');
      }, 500);
    } else {
      setFormError('Invalid email or password');
      
      toast({
        title: "Login Failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Hint",
      description: `Email: ${VALID_EMAIL}, Password: ${VALID_PASSWORD}`,
      variant: "default",
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl font-bold text-primary mb-1">Pixie Dental</h1>
          <p className="text-gray-500">Welcome back!</p>
        </div>
        
        {/* Character illustration */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 200 200" 
            className="w-full h-full"
          >
            {/* Background circle */}
            <circle cx="100" cy="100" r="100" fill={COLORS.secondary}/>
            
            {/* Body */}
            <path 
              stroke={COLORS.dark} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="#FFFFFF" 
              d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
            />
            <path 
              fill={COLORS.light} 
              d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9C143,167.5,122.9,156.4,100,156.4z"
            />
            
            {/* Ears */}
            <g>
              <g fill={COLORS.light} stroke={COLORS.dark} strokeWidth="2.5">
                <circle cx="47" cy="83" r="11.5"/>
                <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <g>
                <rect x="51" y="64" fill="#FFFFFF" width="15" height="35"/>
                <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke={COLORS.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </g>
            <g>
              <g>
                <circle fill={COLORS.light} stroke={COLORS.dark} strokeWidth="2.5" cx="153" cy="83" r="11.5"/>
                <path fill={COLORS.light} stroke={COLORS.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"/>
              </g>
              <g>
                <rect x="134" y="64" fill="#FFFFFF" width="15" height="35"/>
                <path fill="#FFFFFF" stroke={COLORS.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"/>
              </g>
            </g>
            
            {/* Face */}
            <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke={COLORS.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path className="face" fill={COLORS.light} d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"/>
            <path className="hair" fill="#FFFFFF" stroke={COLORS.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"/>
            
            {/* Eyebrows */}
            <g>
              <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"/>
              <path fill="#FFFFFF" stroke={COLORS.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"/>
            </g>
            
            {/* Eyes */}
            <g>
              <circle cx="85.5" cy="78.5" r="3.5" fill={COLORS.dark}/>
              <circle cx="84" cy="76" r="1" fill="#fff"/>
            </g>
            <g>
              <circle cx="114.5" cy="78.5" r="3.5" fill={COLORS.dark}/>
              <circle cx="113" cy="76" r="1" fill="#fff"/>
            </g>
            
            {/* Mouth */}
            <g>
              <path fill={COLORS.primary} d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
              <path fill="none" stroke={COLORS.dark} strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
            </g>
            
            {/* Nose */}
            <path d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill={COLORS.dark}/>
          </svg>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email</label>
            <input
              type="email"
              id="email"
              placeholder={VALID_EMAIL}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
              <button 
                type="button" 
                className="text-xs text-primary hover:underline" 
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div 
                  className="text-gray-400 cursor-pointer"
                  tabIndex={0}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {formError && (
              <p className="text-sm text-red-500">{formError}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-3 font-medium text-white bg-primary hover:bg-dark rounded-md transition duration-300"
          >
            Log In
          </button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;