'use client';

import React, { useState, useEffect } from 'react';
import { THINKING_STEPS } from '@/lib/constants';

export function ThinkingState() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < THINKING_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] px-4 animate-fade-in-up">
      {/* Calm, glowing organic presence */}
      <div className="relative mb-12 flex items-center justify-center w-36 h-36">
        <div 
          className="absolute inset-0 bg-indigo-300/40 rounded-full blur-2xl animate-pulse" 
          style={{ animationDuration: '3s' }} 
        />
        <div 
          className="absolute inset-3 bg-violet-400/30 rounded-full blur-xl animate-pulse" 
          style={{ animationDuration: '2.4s', animationDelay: '0.6s' }} 
        />
        <div 
          className="relative w-20 h-20 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-full shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-transform duration-1000 ease-in-out scale-100 hover:scale-105"
        >
          <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-xs animate-ping" style={{ animationDuration: '2.5s' }} />
        </div>
      </div>
      
      {/* Step Transition Text */}
      <div className="h-16 relative w-full max-w-md flex items-center justify-center">
        {THINKING_STEPS.map((step, idx) => (
          <p
            key={idx}
            className={`absolute text-center text-xl md:text-2xl font-medium tracking-tight text-gray-800 transition-all duration-500 px-4 w-full
              ${idx === stepIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'}
              ${idx < stepIndex ? '-translate-y-3 opacity-0' : ''}
            `}
          >
            {step}
          </p>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-4 tracking-wide font-normal">
        Stepping back to see the whole picture...
      </p>
    </div>
  );
}
