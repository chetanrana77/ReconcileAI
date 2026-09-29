'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onStartClick: () => void;
  onHomeClick?: () => void;
}

export function Navbar({ onStartClick, onHomeClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Demonstration', href: '#demonstration' },
    { label: 'Outcomes', href: '#outcomes' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'FAQ', href: '#faq' },
    { label: 'About', href: '/about' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo: Clean, confident, human */}
        <div
          onClick={onHomeClick || onStartClick}
          className="flex items-center gap-2.5 text-stone-900 font-semibold tracking-tight text-lg cursor-pointer select-none group"
        >
          {/* Subtle balanced emblem: Two calm interlocking circles symbolizing perspective & connection */}
          <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center transition-transform group-hover:scale-[1.02]">
            <svg
              className="w-4 h-4 text-stone-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="12" r="5" stroke="currentColor" fill="none" />
              <circle cx="15" cy="12" r="5" stroke="currentColor" fill="none" opacity="0.6" />
            </svg>
          </div>
          <span className="font-semibold text-stone-900 tracking-tight text-lg">Reconcile</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }
              }}
              className="text-xs uppercase tracking-wider font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Primary CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            size="sm"
            onClick={onStartClick}
            className="rounded-xl px-4 py-2 text-xs font-semibold tracking-tight shadow-xs"
          >
            Try Reconcile
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            size="sm"
            onClick={onStartClick}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            Start
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-stone-200 bg-[#FAF9F6] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  handleLinkClick(link.href);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="block py-2 text-sm font-medium text-stone-700 hover:text-stone-950 border-b border-stone-100/80"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <Button
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartClick();
              }}
              className="w-full text-center font-semibold"
            >
              Tell Me What Happened
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
