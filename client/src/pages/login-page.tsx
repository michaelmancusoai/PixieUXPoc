import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import '../styles/login.css';
import gsap from 'gsap';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLabelClass, setEmailLabelClass] = useState('');
  const [passwordLabelClass, setPasswordLabelClass] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Expected credentials
  const VALID_EMAIL = 'yeti@pixiedental.com';
  const VALID_PASSWORD = 'PlanetPixie';

  // SVG References
  const svgRef = useRef<SVGSVGElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const mySVGRef = useRef<SVGSVGElement>(null);
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const eyeLRef = useRef<SVGGElement>(null);
  const eyeRRef = useRef<SVGGElement>(null);
  const eyebrowLRef = useRef<SVGPathElement>(null);
  const eyebrowRRef = useRef<SVGPathElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const mouthBGRef = useRef<SVGPathElement>(null);
  const mouthSmallBGRef = useRef<SVGPathElement>(null);
  const mouthMediumBGRef = useRef<SVGPathElement>(null);
  const mouthLargeBGRef = useRef<SVGPathElement>(null);
  const mouthMaskPathRef = useRef<SVGPathElement>(null);
  const mouthOutlinePathRef = useRef<SVGPathElement>(null);
  const mouthOutlineRef = useRef<SVGGElement>(null);
  const twoFingers1Ref = useRef<SVGPathElement>(null);
  const twoFingers2Ref = useRef<SVGPathElement>(null);
  const bodyBGnormalRef = useRef<SVGPathElement>(null);
  const bodyBGchangedRef = useRef<SVGPathElement>(null);
  const passwordToggleRef = useRef<HTMLDivElement>(null);
  const showPasswordCheckRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize animations
    if (armLRef.current && armRRef.current) {
      gsap.set(armLRef.current, {
        x: -93,
        y: 220,
        rotation: 105,
        transformOrigin: "top left"
      });
      
      gsap.set(armRRef.current, {
        x: -93,
        y: 220,
        rotation: -105,
        transformOrigin: "top right"
      });
    }

    if (mouthRef.current) {
      gsap.set(mouthRef.current, { 
        transformOrigin: "center center" 
      });
    }

    // Start blinking animation
    const blinkInterval = setInterval(() => {
      blink();
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  const blink = () => {
    if (eyeLRef.current && eyeRRef.current) {
      gsap.to([eyeLRef.current, eyeRRef.current], { 
        duration: 0.1, 
        scaleY: 0, 
        ease: "none", 
        yoyo: true, 
        repeat: 1 
      });
    }
  };

  const handleEmailFocus = () => {
    if (emailRef.current) {
      if (email.length === 0) {
        setEmailLabelClass('');
      } else {
        setEmailLabelClass('focusWithText');
      }
    }
  };

  const handleEmailBlur = () => {
    if (emailRef.current) {
      if (email.length === 0) {
        setEmailLabelClass('');
      } else {
        setEmailLabelClass('focusWithText');
      }
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    if (e.target.value.length === 0) {
      setEmailLabelClass('');
    } else {
      setEmailLabelClass('focusWithText');
    }

    // Eye and mouth animation based on input
    const emailInput = e.target;
    const emailInputRect = emailInput.getBoundingClientRect();
    const svgRect = svgRef.current?.getBoundingClientRect();

    if (svgRect && eyeLRef.current && eyeRRef.current && mouthRef.current) {
      const caretPosition = emailInput.selectionEnd || 0;
      const characterWidth = 8;
      const caretLeft = emailInputRect.left + caretPosition * characterWidth;
      const caretTop = emailInputRect.top + emailInputRect.height / 2;
      
      const eyeLCoords = eyeLRef.current.getBoundingClientRect();
      const eyeRCoords = eyeRRef.current.getBoundingClientRect();
      
      const eyeLAngle = Math.atan2(caretTop - (eyeLCoords.top + eyeLCoords.height / 2), caretLeft - (eyeLCoords.left + eyeLCoords.width / 2));
      const eyeRAngle = Math.atan2(caretTop - (eyeRCoords.top + eyeRCoords.height / 2), caretLeft - (eyeRCoords.left + eyeRCoords.width / 2));
      
      const eyeLX = Math.cos(eyeLAngle) * 4;
      const eyeLY = Math.sin(eyeLAngle) * 2;
      const eyeRX = Math.cos(eyeRAngle) * 4;
      const eyeRY = Math.sin(eyeRAngle) * 2;
      
      gsap.to(eyeLRef.current, {
        x: eyeLX,
        y: eyeLY,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(eyeRRef.current, {
        x: eyeRX,
        y: eyeRY,
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Mouth animation based on input length
      if (e.target.value.length > 0) {
        if (e.target.value.includes('@')) {
          gsap.to(mouthRef.current, {
            scaleX: 0.8,
            scaleY: 0.8,
            y: 2,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to([eyeLRef.current, eyeRRef.current], {
            scaleY: 0.6,
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          gsap.to(mouthRef.current, {
            scaleX: 1,
            scaleY: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to([eyeLRef.current, eyeRRef.current], {
            scaleY: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      } else {
        // Reset mouth and eyes
        gsap.to(mouthRef.current, {
          scaleX: 1,
          scaleY: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to([eyeLRef.current, eyeRRef.current], {
          scaleY: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };

  const handlePasswordFocus = () => {
    if (passwordRef.current) {
      if (password.length === 0) {
        setPasswordLabelClass('');
      } else {
        setPasswordLabelClass('focusWithText');
      }
      
      // Cover eyes with hands animation
      if (armLRef.current && armRRef.current && bodyBGnormalRef.current && bodyBGchangedRef.current) {
        gsap.set(bodyBGnormalRef.current, { display: "none" });
        gsap.set(bodyBGchangedRef.current, { display: "block" });
        
        gsap.to(armLRef.current, {
          x: -93,
          y: 10,
          rotation: 0,
          ease: "power2.out",
          duration: 0.3
        });
        
        gsap.to(armRRef.current, {
          x: -93,
          y: 10,
          rotation: 0,
          ease: "power2.out",
          duration: 0.3,
          delay: 0.1
        });
      }
    }
  };

  const handlePasswordBlur = () => {
    if (passwordRef.current) {
      if (password.length === 0) {
        setPasswordLabelClass('');
      } else {
        setPasswordLabelClass('focusWithText');
      }
      
      // Uncover eyes animation
      if (armLRef.current && armRRef.current && bodyBGnormalRef.current && bodyBGchangedRef.current) {
        gsap.set(bodyBGnormalRef.current, { display: "block" });
        gsap.set(bodyBGchangedRef.current, { display: "none" });
        
        gsap.to(armLRef.current, {
          x: -93,
          y: 220,
          rotation: 105,
          ease: "power2.out",
          duration: 0.4
        });
        
        gsap.to(armRRef.current, {
          x: -93,
          y: 220,
          rotation: -105,
          ease: "power2.out",
          duration: 0.4,
          delay: 0.1
        });
      }
    }
  };

  const handleTogglePassword = () => {
    if (showPasswordCheckRef.current && twoFingers1Ref.current && twoFingers2Ref.current) {
      if (showPasswordCheckRef.current.checked) {
        // Spread fingers apart animation
        gsap.to([twoFingers1Ref.current, twoFingers2Ref.current], {
          rotation: 30,
          x: -9,
          y: -2,
          transformOrigin: "bottom left",
          duration: 0.2,
          ease: "power2.out"
        });
      } else {
        // Close fingers animation
        gsap.to([twoFingers1Ref.current, twoFingers2Ref.current], {
          rotation: 0,
          x: 0,
          y: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Success animation
      if (svgRef.current && mouthRef.current && eyeLRef.current && eyeRRef.current) {
        // Happy face
        gsap.to(mouthRef.current, {
          scaleX: 1.2,
          scaleY: 0.8,
          y: 2,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to([eyeLRef.current, eyeRRef.current], {
          scaleY: 0.5,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            // Display success toast after animation
            toast({
              title: "Login Successful!",
              description: "Welcome to Pixie Dental!",
            });
            
            // Redirect after successful animation
            setTimeout(() => {
              setLocation('/dashboard');
            }, 800);
          }
        });
        
        // Bounce animation
        gsap.to(svgRef.current, {
          y: -20,
          duration: 0.3,
          ease: "power2.out",
          repeat: 1,
          yoyo: true
        });
      } else {
        // Fallback if animation fails
        toast({
          title: "Login Successful!",
          description: "Welcome to Pixie Dental!",
        });
        setLocation('/dashboard');
      }
    } else {
      // Error animation
      if (svgRef.current && mouthRef.current && eyeLRef.current && eyeRRef.current) {
        // Sad face
        gsap.to(mouthRef.current, {
          scaleX: 0.8,
          scaleY: 1.2,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to([eyeLRef.current, eyeRRef.current], {
          scaleY: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Shake head animation
        gsap.to(svgRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(svgRef.current, {
              x: 0,
              duration: 0.2
            });
          }
        });
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Hint",
      description: `Email: ${VALID_EMAIL}, Password: ${VALID_PASSWORD}`,
    });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="login-form">
        <div className="svgContainer">
          <div>
            <svg
              ref={svgRef}
              className="mySVG"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 200 200"
            >
              <defs>
                <circle id="armMaskPath" cx="100" cy="100" r="100" />
              </defs>
              <clipPath id="armMask">
                <use xlinkHref="#armMaskPath" overflow="visible" />
              </clipPath>
              <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
              <g className="body">
                <path
                  ref={bodyBGchangedRef}
                  className="bodyBGchanged"
                  style={{ display: "none" }}
                  fill="#FFFFFF"
                  d="M200,122h-35h-14.9V72c0-27.6-22.4-50-50-50s-50,22.4-50,50v50H35.8H0l0,91h200L200,122z"
                />
                <path
                  ref={bodyBGnormalRef}
                  className="bodyBGnormal"
                  stroke="#3A5E77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#FFFFFF"
                  d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
                />
                <path
                  fill="#DDF1FA"
                  d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"
                />
              </g>
              <g className="earL">
                <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                  <circle cx="47" cy="83" r="11.5" />
                  <path
                    d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g className="earHair">
                  <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path
                    d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
                    fill="#fff"
                    stroke="#3a5e77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g className="earR">
                <g className="outerEar">
                  <circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5" />
                  <path
                    fill="#DDF1FA"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"
                  />
                </g>
                <g className="earHair">
                  <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path
                    fill="#FFFFFF"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"
                  />
                </g>
              </g>
              <path
                className="chin"
                d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1"
                fill="none"
                stroke="#3a5e77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="face"
                fill="#DDF1FA"
                d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
              />
              <path
                className="hair"
                fill="#FFFFFF"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"
              />
              <g className="eyebrow">
                <path
                  fill="#FFFFFF"
                  d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"
                />
                <path
                  ref={eyebrowLRef}
                  fill="#FFFFFF"
                  stroke="#3A5E77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"
                />
                <path
                  ref={eyebrowRRef}
                  fill="#FFFFFF"
                  stroke="#3A5E77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"
                />
              </g>
              <g ref={eyeLRef} className="eyeL">
                <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="84" cy="76" r="1" fill="#fff" />
              </g>
              <g ref={eyeRRef} className="eyeR">
                <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="113" cy="76" r="1" fill="#fff" />
              </g>
              <g ref={mouthRef} className="mouth">
                <path
                  ref={mouthBGRef}
                  className="mouthBG"
                  fill="#617E92"
                  d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                />
                <path
                  className="mouthOutline"
                  fill="none"
                  stroke="#3A5E77"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                />
              </g>
              <path
                className="nose"
                d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"
                fill="#3a5e77"
              />
              <g className="arms" clipPath="url(#armMask)">
                <g ref={armLRef} className="armL">
                  <path
                    fill="#ddf1fa"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="M121.3 97.4L111 58.7l38.8-10.4 20 36.1z"
                  />
                  <path
                    fill="#ddf1fa"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="M134.4 52.5l19.3-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1L146 59.7M160.8 76.5l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M158.3 66.8l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M150.9 58.4l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"
                  />
                  <g>
                    <path 
                      ref={twoFingers1Ref}
                      fill="#a9ddf3" 
                      d="M178.8 74.7l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM180.1 64l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8z" 
                    />
                    <path 
                      ref={twoFingers2Ref} 
                      fill="#a9ddf3" 
                      d="M175.5 54.9l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM152.1 49.4l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8z" 
                    />
                  </g>
                  <path
                    fill="#fff"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M123.5 96.8c-41.4 14.9-84.1 30.7-108.2 35.5L1.2 80c33.5-9.9 71.9-16.5 111.9-21.8"
                  />
                  <path
                    fill="#fff"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M108.5 59.4c7.7-5.3 14.3-8.4 22.8-13.2-2.4 5.3-4.7 10.3-6.7 15.1 4.3.3 8.4.7 12.3 1.3-4.2 5-8.1 9.6-11.5 13.9 3.1 1.1 6 2.4 8.7 3.8-1.4 2.9-2.7 5.8-3.9 8.5 2.5 3.5 4.6 7.2 6.3 11-4.9-.8-9-.7-16.2-2.7M94.5 102.8c-.6 4-3.8 8.9-9.4 14.7-2.6-1.8-5-3.7-7.2-5.7-2.5 4.1-6.6 8.8-12.2 14-1.9-2.2-3.4-4.5-4.5-6.9-4.4 3.3-9.5 6.9-15.4 10.8-.2-3.4.1-7.1 1.1-10.9M97.5 62.9c-1.7-2.4-5.9-4.1-12.4-5.2-.9 2.2-1.8 4.3-2.5 6.5-3.8-1.8-9.4-3.1-17-3.8.5 2.3 1.2 4.5 1.9 6.8-5-.6-11.2-.9-18.4-1 2 2.9.9 3.5 3.9 6.2"
                  />
                </g>
                <g ref={armRRef} className="armR">
                  <path
                    fill="#ddf1fa"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"
                  />
                  <path
                    fill="#ddf1fa"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"
                  />
                  <path
                    fill="#a9ddf3"
                    d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z"
                  />
                  <path
                    fill="#fff"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1"
                  />
                  <path
                    fill="#fff"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`inputGroup inputGroup1 ${emailLabelClass}`}>
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              value={email}
              onChange={handleEmailInput}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              maxLength={256}
              required
            />
            <span className="helper helper1">Email</span>
          </div>
          <div className={`inputGroup inputGroup2 ${passwordLabelClass}`}>
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type={showPasswordCheckRef.current?.checked ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              required
            />
            <div ref={passwordToggleRef} id="showPasswordToggle" className="cursor-pointer">
              <input
                ref={showPasswordCheckRef}
                type="checkbox"
                id="showPasswordCheck"
                onChange={handleTogglePassword}
              />
              <label htmlFor="showPasswordCheck">Show Password</label>
              <div className="indicator"></div>
            </div>
            <a href="#" onClick={handleForgotPassword} className="text-sm text-[#4eb8dd] hover:underline mt-2 block text-right">
              Forgot Password?
            </a>
          </div>
          <div className="inputGroup inputGroup3">
            <button type="submit">Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;