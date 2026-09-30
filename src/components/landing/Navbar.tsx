'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Menu, X, Globe } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/translations';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onStartClick: () => void;
  onHomeClick?: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export function Navbar({ onStartClick, onHomeClick, language = 'en', onLanguageChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lt = getLandingTranslations(language);

  const navLinks = [
    { label: lt.navbar.howItWorks, href: '#how-it-works' },
    { label: lt.navbar.demonstration, href: '#demonstration' },
    { label: lt.navbar.outcomes, href: '#outcomes' },
    { label: lt.navbar.privacy, href: '#privacy' },
    { label: lt.navbar.faq, href: '#faq' },
    { label: lt.navbar.about, href: '/about' },
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

        {/* Primary CTA & Language Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center p-0.5 rounded-xl bg-stone-200/60 border border-stone-200/80">
            {SUPPORTED_LANGUAGES.map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange?.(l.code)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium select-none",
                    isSelected
                      ? "bg-white text-stone-900 shadow-2xs font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  )}
                  title={`Talk in ${l.label}`}
                >
                  {l.native}
                </button>
              );
            })}
          </div>

          <Button
            size="sm"
            onClick={onStartClick}
            className="rounded-xl px-4 py-2 text-xs font-semibold tracking-tight shadow-xs"
          >
            {lt.navbar.tryReconcile}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <div className="inline-flex items-center p-0.5 rounded-lg bg-stone-200/60 border border-stone-200/80">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => onLanguageChange?.(l.code)}
                className={cn(
                  "text-[11px] px-1.5 py-0.5 rounded transition-all font-medium",
                  language === l.code
                    ? "bg-white text-stone-900 font-semibold"
                    : "text-stone-600"
                )}
              >
                {l.native}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={onStartClick}
            className="rounded-lg px-2.5 py-1 text-xs font-semibold"
          >
            {lt.navbar.start}
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
              {lt.navbar.tellMeWhatHappened}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
