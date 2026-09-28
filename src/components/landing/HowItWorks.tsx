'use client';

import React from 'react';
import { MessageSquareText, Shield, UserPlus, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const steps = [
  {
    icon: MessageSquareText,
    number: '01',
    title: 'You talk. We listen.',
    description: 'Tell us what happened like you\'d tell a close friend. Be as angry, hurt, or messy as you need to be. This is just between you and Reconcile.'
  },
  {
    icon: Shield,
    number: '02',
    title: 'We find what you actually mean.',
    description: 'Underneath the anger, there\'s usually a need — to be trusted, heard, or respected. We help you see it clearly so your message lands.'
  },
  {
    icon: UserPlus,
    number: '03',
    title: 'We reach out to them (gently).',
    description: 'We send the other person a calm, neutral invite — no blame, no accusation. Your raw words are never forwarded. Ever.'
  },
  {
    icon: Users,
    number: '04',
    title: 'Both sides finally make sense.',
    description: 'They share their side privately too. Then we show you both where things got crossed — and give you the words to actually fix it.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-14 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          How It Works
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          From &ldquo;I can&apos;t talk to them&rdquo; to &ldquo;I know exactly what to say.&rdquo;
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Four steps. Two private conversations. One moment of clarity where you finally understand each other.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card 
            key={index} 
            hoverable 
            className="p-6 flex flex-col text-left animate-fade-in-up bg-white border border-gray-100 shadow-2xs hover:shadow-md transition-all relative" 
            style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
          >
            {/* Step number accent */}
            <span className="text-5xl font-black text-indigo-100 absolute top-4 right-5 select-none pointer-events-none">
              {step.number}
            </span>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-5 border border-indigo-100/60">
              <step.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
