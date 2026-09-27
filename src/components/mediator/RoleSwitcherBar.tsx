'use client';

import React from 'react';
import { Shield, Users, ArrowRightLeft, Sparkles, Eye } from 'lucide-react';
import { ParticipantRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RoleSwitcherBarProps {
  currentRole: ParticipantRole;
  currentStep: string;
  isReadyForMediation: boolean;
  hasInvitation: boolean;
  onSwitchRole: (newRole: ParticipantRole) => void;
  onOpenMediation: () => void;
  onLoadFlagshipDemo: (demoKey: string) => void;
}

export function RoleSwitcherBar({
  currentRole,
  currentStep,
  isReadyForMediation,
  hasInvitation,
  onSwitchRole,
  onOpenMediation,
  onLoadFlagshipDemo
}: RoleSwitcherBarProps) {
  return (
    <div className="w-full bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-slate-800 z-40 sticky top-16">
      {/* Left: Role Indicator & Privacy Badge */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="flex items-center gap-1 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Strict Privacy Isolation
        </span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">
          Current View: <strong className="text-white">{currentRole === 'a' ? 'Person A (Child / Alex)' : 'Person B (Parent / Morgan)'}</strong>
        </span>
      </div>

      {/* Center / Right: Interactive Controls for Demonstrating Both Sides */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Toggle between Person A and Person B */}
        <button
          type="button"
          onClick={() => onSwitchRole(currentRole === 'a' ? 'b' : 'a')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
          title="Switch perspective between Person A and Person B to test isolation"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
          <span>Switch to {currentRole === 'a' ? 'Person B (Parent)' : 'Person A (Child)'}</span>
        </button>

        {/* View Joint Mediation Bridge */}
        <button
          type="button"
          onClick={onOpenMediation}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer font-medium",
            currentStep === 'mediation'
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-800/60"
          )}
        >
          <Users className="w-3.5 h-3.5 text-indigo-300" />
          <span>Mediation Bridge</span>
        </button>

        {/* Flagship Demo Quick Loader */}
        <button
          type="button"
          onClick={() => onLoadFlagshipDemo('demo-parent-child')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer border border-amber-500/40"
          title="Load complete Flagship Parent ↔ Child Demo Session"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Load Flagship Demo</span>
        </button>
      </div>
    </div>
  );
}
