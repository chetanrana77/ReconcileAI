'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onStartClick: () => void;
  onHomeClick?: () => void;
}

export function Navbar({ onStartClick, onHomeClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={onHomeClick || onStartClick}
          className="flex items-center gap-2 text-[var(--color-primary-700)] font-bold text-xl cursor-pointer hover:opacity-90 transition-opacity"
        >
          <HeartHandshake className="w-6 h-6" />
          <span>Reconcile</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline"
          >
            About
          </Link>
          <Button size="sm" onClick={onStartClick} className="rounded-full cursor-pointer">
            Start Free — No Signup
          </Button>
        </div>
      </div>
    </nav>
  );
}
