'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RelationshipType, ConflictInput as IConflictInput, EmotionType } from '@/lib/types';
import { EMOTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ConflictInputProps {
  relationship: RelationshipType;
  onSubmit: (input: IConflictInput) => void;
  onBack: () => void;
}

const RELATIONSHIP_EMOJI: Record<string, string> = {
  friend: '❤️',
  parent: '🏠',
  sibling: '🧩',
  partner: '💞',
  classmate: '🎓',
  other: '💬'
};

const RELATIONSHIP_LABEL: Record<string, string> = {
  friend: 'Friend',
  parent: 'Parent',
  sibling: 'Sibling',
  partner: 'Partner',
  classmate: 'Classmate',
  other: 'Someone Else'
};

const PLACEHOLDERS: Record<string, string> = {
  friend: "My friend hasn't replied to me for two days and...",
  parent: "My parents are always comparing me to...",
  sibling: "My sibling took my things without asking...",
  partner: "We keep having the same argument about...",
  classmate: "We were working on a group project and...",
  other: "Tell me what happened from the beginning..."
};

const SAMPLE_SCENARIOS: Record<string, { story: string; emotions: EmotionType[] }> = {
  friend: {
    story: "My friend hasn't replied to my messages for two days. I feel like they don't care about our friendship.",
    emotions: ['hurt', 'ignored', 'sad']
  },
  parent: {
    story: "My parents keep asking about my studies and I feel like they don't trust me.",
    emotions: ['frustrated', 'angry', 'disappointed']
  },
  sibling: {
    story: "My brother keeps using my things without asking.",
    emotions: ['angry', 'frustrated', 'ignored']
  },
  partner: {
    story: "I feel like my partner doesn't really listen when I talk.",
    emotions: ['hurt', 'frustrated', 'sad']
  },
  classmate: {
    story: "My classmate didn't include me in the group project discussion.",
    emotions: ['left-out', 'hurt', 'confused']
  },
  other: {
    story: "Someone at work took credit for my idea during an important meeting.",
    emotions: ['angry', 'hurt', 'frustrated']
  }
};

export function ConflictInput({ relationship, onSubmit, onBack }: ConflictInputProps) {
  const [story, setStory] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  
  const toggleEmotion = (emotion: EmotionType) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleUseSample = () => {
    const sample = SAMPLE_SCENARIOS[relationship] || SAMPLE_SCENARIOS.friend;
    setStory(sample.story);
    setSelectedEmotions(sample.emotions);
  };
  
  const isSubmitDisabled = story.trim().length === 0 || selectedEmotions.length === 0;
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in-up">
      <button 
        type="button"
        onClick={onBack}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
        Back to relationship
      </button>
      
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl bg-indigo-50 border border-indigo-100 rounded-full w-9 h-9 flex items-center justify-center">
              {RELATIONSHIP_EMOJI[relationship] || '💬'}
            </span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
              {RELATIONSHIP_LABEL[relationship] || relationship}
            </span>
          </div>

          <button
            type="button"
            onClick={handleUseSample}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-indigo-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Use example situation</span>
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Okay, what happened?
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Just tell me like you&apos;d tell a friend. I&apos;ll help make sense of it.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="relative">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value.slice(0, 2000))}
            placeholder={PLACEHOLDERS[relationship] || "Start typing..."}
            className="w-full min-h-[200px] p-6 text-base sm:text-lg bg-white border border-gray-200 rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-all placeholder:text-gray-400 shadow-2xs leading-relaxed"
            rows={6}
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium bg-white/80 px-2 py-0.5 rounded-md">
            {story.length}/2000
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              And how did that make you feel?
            </h2>
            <span className="text-xs text-gray-400">Select all that apply</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {EMOTIONS.map((emo) => {
              const isSelected = selectedEmotions.includes(emo.id);
              return (
                <button
                  type="button"
                  key={emo.id}
                  onClick={() => toggleEmotion(emo.id)}
                  className={cn(
                    "px-4 py-2 rounded-full border transition-all text-sm font-medium flex items-center gap-2 cursor-pointer shadow-2xs",
                    isSelected
                      ? "bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className="text-base">{emo.emoji}</span>
                  <span>{emo.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 text-center sm:text-left">
            {story.trim().length === 0 && selectedEmotions.length === 0 ? (
              <span>Share what happened and select at least one feeling to continue</span>
            ) : story.trim().length === 0 ? (
              <span>Please describe what happened</span>
            ) : selectedEmotions.length === 0 ? (
              <span>Pick at least one feeling above</span>
            ) : (
              <span className="text-emerald-600 font-medium">Ready when you are</span>
            )}
          </div>

          <Button 
            size="lg" 
            onClick={() => onSubmit({ relationship, story, emotions: selectedEmotions })}
            disabled={isSubmitDisabled}
            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-semibold shadow-md shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            Help Me Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
