'use client';

import React from 'react';
import { MessageSquareText, Shield, UserPlus, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const steps = [
  {
    icon: MessageSquareText,
    title: '1. Talk Privately First',
    description: 'Tell Reconcile what happened in your own words. Vent safely without fear of escalating things.'
  },
  {
    icon: Shield,
    title: '2. Uncover True Intent',
    description: 'Reconcile translates raw anger into your underlying need, separating feelings from reactive assumptions.'
  },
  {
    icon: UserPlus,
    title: '3. Neutral Invitation',
    description: 'We invite the other person with a neutral, compassionate summary. Your raw messages are never forwarded.'
  },
  {
    icon: Users,
    title: '4. The Mediation Bridge',
    description: 'They share their side privately too. Then Reconcile bridges the gap, reveals common ground, and helps you communicate.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-14 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          The Two-Sided Process
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          How Reconcile Mediates
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
          Not a chatbot. A communication bridge that helps both people feel heard.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card 
            key={index} 
            hoverable 
            className="p-6 flex flex-col items-center text-center animate-fade-in-up bg-white border border-gray-100 shadow-2xs hover:shadow-md transition-all" 
            style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
          >
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
