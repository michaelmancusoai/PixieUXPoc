import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Expected credentials
  const VALID_EMAIL = 'pixie@pixiedental.com';
  const VALID_PASSWORD = 'PlanetPixie';

  // SVG animation states
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const eyeLRef = useRef<SVGGElement>(null);
  const eyeRRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGGElement>(null);
  const noseRef = useRef<SVGPathElement>(null);
  const twoFingersRef = useRef<SVGGElement>(null);
  const bodyBGRef = useRef<SVGPathElement>(null);
  const bodyBGchangedRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Initial setup for SVG animation
    if (armLRef.current && armRRef.current) {
      // Initial arm positions
      armLRef.current.style.transform = 'translateX(-93px) translateY(220px) rotate(105deg)';
      armLRef.current.style.transformOrigin = 'top left';
      armRRef.current.style.transform = 'translateX(-93px) translateY(220px) rotate(-105deg)';
      armRRef.current.style.transformOrigin = 'top right';
      armLRef.current.style.visibility = 'hidden';
      armRRef.current.style.visibility = 'hidden';
    }
    
    // Start the blinking animation
    const blinkingInterval = setInterval(() => {
      if (eyeLRef.current && eyeRRef.current && focusedInput !== 'email') {
        // Blink animation
        eyeLRef.current.style.transform = 'scaleY(0)';
        eyeRRef.current.style.transform = 'scaleY(0)';
        
        setTimeout(() => {
          if (eyeLRef.current && eyeRRef.current) {
            eyeLRef.current.style.transform = '';
            eyeRRef.current.style.transform = '';
          }
        }, 100);
      }
    }, 3000);

    return () => {
      clearInterval(blinkingInterval);
    };
  }, [focusedInput]);

  const handleEmailFocus = () => {
    setFocusedInput('email');
  };

  const handlePasswordFocus = () => {
    setFocusedInput('password');
    coverEyes();
  };

  const handleEmailBlur = () => {
    setTimeout(() => {
      if (focusedInput !== 'password') {
        setFocusedInput(null);
        resetFace();
      }
    }, 100);
  };

  const handlePasswordBlur = () => {
    setTimeout(() => {
      if (focusedInput !== 'toggle') {
        setFocusedInput(null);
        uncoverEyes();
      }
    }, 100);
  };

  const handleToggleFocus = () => {
    setFocusedInput('toggle');
    coverEyes();
  };

  const handleToggleBlur = () => {
    setTimeout(() => {
      if (focusedInput !== 'password') {
        setFocusedInput(null);
        uncoverEyes();
      }
    }, 100);
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Face reactions based on email input
    if (e.target.value.length > 0) {
      if (e.target.value.includes('@')) {
        // Happy/excited face
        if (eyeLRef.current && eyeRRef.current) {
          eyeLRef.current.style.transform = 'scale(0.65)';
          eyeRRef.current.style.transform = 'scale(0.65)';
        }
      } else {
        // Curious face
        if (eyeLRef.current && eyeRRef.current) {
          eyeLRef.current.style.transform = 'scale(0.85)';
          eyeRRef.current.style.transform = 'scale(0.85)';
        }
      }
    } else {
      // Reset face
      if (eyeLRef.current && eyeRRef.current) {
        eyeLRef.current.style.transform = '';
        eyeRRef.current.style.transform = '';
      }
    }
    
    // Move eyes to follow cursor
    moveEyesToFollowCursor(e.target);
  };

  const moveEyesToFollowCursor = (inputElement: HTMLInputElement) => {
    if (!eyeLRef.current || !eyeRRef.current || !noseRef.current || !mouthRef.current) return;
    
    const inputRect = inputElement.getBoundingClientRect();
    const caretPosition = inputElement.selectionEnd || inputElement.value.length;
    const caretX = inputRect.left + (caretPosition * 8); // Approximate position
    
    // Calculate angle and distance for eye movement
    const eyeL = eyeLRef.current.getBoundingClientRect();
    const eyeR = eyeRRef.current.getBoundingClientRect();
    
    const eyeLAngle = Math.atan2(inputRect.top - eyeL.top, caretX - eyeL.left);
    const eyeRAngle = Math.atan2(inputRect.top - eyeR.top, caretX - eyeR.left);
    
    const eyeLX = Math.cos(eyeLAngle) * 5;
    const eyeLY = Math.sin(eyeLAngle) * 3;
    const eyeRX = Math.cos(eyeRAngle) * 5;
    const eyeRY = Math.sin(eyeRAngle) * 3;
    
    eyeLRef.current.style.transform = `translate(${-eyeLX}px, ${-eyeLY}px)`;
    eyeRRef.current.style.transform = `translate(${-eyeRX}px, ${-eyeRY}px)`;
    noseRef.current.style.transform = `translate(${-eyeLX * 0.5}px, ${-eyeLY * 0.5}px)`;
    mouthRef.current.style.transform = `translate(${-eyeLX * 0.5}px, ${-eyeLY * 0.5}px)`;
  };

  const spreadFingers = () => {
    if (twoFingersRef.current) {
      twoFingersRef.current.style.transform = 'rotate(30deg) translateX(-9px) translateY(-2px)';
      twoFingersRef.current.style.transformOrigin = 'bottom left';
    }
  };

  const closeFingers = () => {
    if (twoFingersRef.current) {
      twoFingersRef.current.style.transform = '';
    }
  };

  const coverEyes = () => {
    if (armLRef.current && armRRef.current && bodyBGRef.current && bodyBGchangedRef.current) {
      armLRef.current.style.visibility = 'visible';
      armRRef.current.style.visibility = 'visible';
      
      armLRef.current.style.transform = 'translateX(-93px) translateY(10px) rotate(0deg)';
      armRRef.current.style.transform = 'translateX(-93px) translateY(10px) rotate(0deg)';
      
      bodyBGRef.current.style.display = 'none';
      bodyBGchangedRef.current.style.display = 'block';
    }
  };

  const uncoverEyes = () => {
    if (armLRef.current && armRRef.current && bodyBGRef.current && bodyBGchangedRef.current) {
      armLRef.current.style.transform = 'translateX(-93px) translateY(220px) rotate(105deg)';
      armRRef.current.style.transform = 'translateX(-93px) translateY(220px) rotate(-105deg)';
      
      setTimeout(() => {
        if (armLRef.current && armRRef.current) {
          armLRef.current.style.visibility = 'hidden';
          armRRef.current.style.visibility = 'hidden';
        }
      }, 1000);
      
      bodyBGRef.current.style.display = 'block';
      bodyBGchangedRef.current.style.display = 'none';
    }
  };

  const resetFace = () => {
    if (eyeLRef.current && eyeRRef.current && noseRef.current && mouthRef.current) {
      eyeLRef.current.style.transform = '';
      eyeRRef.current.style.transform = '';
      noseRef.current.style.transform = '';
      mouthRef.current.style.transform = '';
    }
  };

  const handleToggleChange = () => {
    setShowPassword(!showPassword);
    if (!showPassword) {
      spreadFingers();
    } else {
      closeFingers();
    }
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
      setLocation('/dashboard');
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
    <div className="h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl bg-white relative overflow-visible">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-[#217093] mb-1">Pixie Dental</h1>
          <p className="text-gray-500">Please log in to continue</p>
        </div>
        
        <div ref={svgContainerRef} className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200">
            <defs>
              <circle id="armMaskPath" cx="100" cy="100" r="100"/>      
            </defs>
            <clipPath id="armMask">
              <use xlinkHref="#armMaskPath" overflow="visible"/>
            </clipPath>
            <circle cx="100" cy="100" r="100" fill="#4eb8dd"/>
            <g className="body">
              <path ref={bodyBGchangedRef} style={{display: 'none'}} fill="#FFFFFF" d="M200,122h-35h-14.9V72c0-27.6-22.4-50-50-50s-50,22.4-50,50v50H35.8H0l0,91h200L200,122z"/>
              <path ref={bodyBGRef} stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"/>
              <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"/>
            </g>
            <g className="earL">
              <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                <circle cx="47" cy="83" r="11.5"/>
                <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <g className="earHair">
                <rect x="51" y="64" fill="#FFFFFF" width="15" height="35"/>
                <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </g>
            <g className="earR">
              <g className="outerEar">
                <circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5"/>
                <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"/>
              </g>
              <g className="earHair">
                <rect x="134" y="64" fill="#FFFFFF" width="15" height="35"/>
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"/>
              </g>
            </g>
            <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"/>
            <path className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"/>
            <g className="eyebrow">
              <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"/>
              <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"/>
            </g>
            <g ref={eyeLRef} className="eyeL">
              <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77"/>
              <circle cx="84" cy="76" r="1" fill="#fff"/>
            </g>
            <g ref={eyeRRef} className="eyeR">
              <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77"/>
              <circle cx="113" cy="76" r="1" fill="#fff"/>
            </g>
            <g ref={mouthRef} className="mouth">
              <path className="mouthBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
              <path className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
            </g>
            <path ref={noseRef} className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77"/>
            <g className="arms" clipPath="url(#armMask)">
              <g ref={armLRef} className="armL">
                <polygon fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"/>
                <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8"/>
                <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7"/>
                
                <g ref={twoFingersRef} className="twoFingers">                  
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2"/>
                  <path fill="#A9DDF3" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z"/>
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9"/>
                  <path fill="#A9DDF3" d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z"/>
                </g>
                <path fill="#A9DDF3" d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z"/>
                <path fill="#A9DDF3" d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z"/>
              </g>
              <g ref={armRRef} className="armR">
                <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"/>
                <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"/>
              </g>                              
            </g>
          </svg>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label 
              htmlFor="email" 
              className="block text-[#217093] font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailInput}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              className="w-full h-12 px-4 py-2 bg-[#f3fafd] border-2 border-[#217093] rounded text-gray-700 focus:border-[#4eb8dd] focus:outline-none transition-all"
              autoComplete="off"
              required
            />
            <p className={`text-sm text-gray-400 absolute ${email ? 'opacity-0' : 'opacity-70'} pointer-events-none transform translate-x-4 -translate-y-8`}>
              pixie@pixiedental.com
            </p>
          </div>

          <div className="mb-6 relative">
            <label 
              htmlFor="password" 
              className="block text-[#217093] font-bold mb-2 flex justify-between"
            >
              <span>Password</span>
              <div className="flex items-center">
                <input
                  id="showPassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleToggleChange}
                  onFocus={handleToggleFocus}
                  onBlur={handleToggleBlur}
                  className="sr-only"
                />
                <label
                  htmlFor="showPassword"
                  className="text-sm font-normal cursor-pointer flex items-center"
                >
                  <span>Show</span>
                  <div className="ml-2 w-4 h-4 border-2 border-[#217093] rounded relative">
                    {showPassword && (
                      <span className="absolute -top-1 -left-0.5 transform rotate-45 w-2 h-4 border-b-2 border-r-2 border-[#217093]"></span>
                    )}
                  </div>
                </label>
              </div>
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className="w-full h-12 px-4 py-2 bg-[#f3fafd] border-2 border-[#217093] rounded text-gray-700 focus:border-[#4eb8dd] focus:outline-none transition-all"
              required
            />
          </div>

          {formError && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-[#4eb8dd] hover:bg-[#217093] text-white rounded text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4eb8dd]"
          >
            Log in
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={handleForgotPassword}
            className="text-sm text-[#217093] hover:text-[#4eb8dd] transition-colors"
          >
            Forgot password?
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;