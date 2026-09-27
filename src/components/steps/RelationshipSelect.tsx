'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { RelationshipType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RelationshipSelectProps {
  onSelect: (relationship: RelationshipType) => void;
}

const RELATIONSHIPS: { type: RelationshipType; emoji: string; label: string; desc: string }[] = [
  { type: 'friend', emoji: '❤️', label: 'Friend', desc: 'Something happened with a friend' },
  { type: 'parent', emoji: '🏠', label: 'Parent', desc: "My parents don't understand me" },
  { type: 'sibling', emoji: '🧩', label: 'Sibling', desc: 'My sibling and I keep arguing' },
  { type: 'partner', emoji: '💞', label: 'Partner', desc: "I'm having trouble with my partner" },
  { type: 'classmate', emoji: '🎓', label: 'Classmate', desc: 'Something happened at school' },
  { type: 'other', emoji: '💬', label: 'Someone else', desc: "It's complicated" },
];

export function RelationshipSelect({ onSelect }: RelationshipSelectProps) {
  const [typedText, setTypedText] = useState('');
  const fullText = "What's going on?";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-medium text-gray-500 mb-2">Okay. I'm here.</h2>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 h-14">
          {typedText}<span className="animate-pulse">|</span>
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RELATIONSHIPS.map((rel, index) => (
          <Card
            key={rel.type}
            hoverable
            onClick={() => onSelect(rel.type)}
            className="p-5 cursor-pointer flex items-start gap-4 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="text-4xl bg-gray-50 rounded-xl p-2">{rel.emoji}</div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{rel.label}</h3>
              <p className="text-sm text-gray-500">{rel.desc}</p>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <button 
          type="button"
          onClick={() => onSelect('other')}
          className="text-sm text-gray-500 hover:text-[var(--color-primary-600)] transition-colors underline underline-offset-4 cursor-pointer"
        >
          Or tell me in your own words
        </button>
      </div>
    </div>
  );
}
