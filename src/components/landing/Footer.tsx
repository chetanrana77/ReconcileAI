'use client';

import React from 'react';
import Link from 'next/link';
import { SupportedLanguage } from '@/lib/types';
import { getLandingTranslations } from '@/lib/i18n/landingTranslations';

interface FooterProps {
  language?: SupportedLanguage;
}

export function Footer({ language = 'en' }: FooterProps) {
  const lt = getLandingTranslations(language);
  const ft = lt.footer;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200/80 bg-[#FAF9F6] py-16 text-stone-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Philosophy */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2 text-stone-900 font-semibold tracking-tight text-base">
              <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-stone-100"
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
              <span>Reconcile</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              {ft.philosophy}
            </p>
            <p className="text-xs text-stone-500 leading-relaxed font-normal">
              {ft.mission}
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-3">
              <span className="font-semibold text-stone-900 uppercase tracking-wider block">
                {ft.productTitle}
              </span>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <button
                    onClick={() => scrollTo('how-it-works')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    {lt.navbar.howItWorks}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('privacy')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    {lt.navbar.privacy}
                  </button>
                </li>
                <li>
                  <Link href="/about" className="hover:text-stone-900">
                    {lt.navbar.about}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="font-semibold text-stone-900 uppercase tracking-wider block">
                {ft.resourcesTitle}
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {ft.crisisDesc}
              </p>
              <div className="space-y-1.5 pt-1 text-[11px] text-stone-700">
                <p className="font-medium text-stone-900">{ft.teleManas}</p>
                <p>{ft.aasra}</p>
                <p>{ft.vandrevala}</p>
                <p className="text-amber-800 font-semibold">{ft.emergency112}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{ft.copyright}</p>
          <div className="flex items-center gap-6">
            <span>{ft.builtWithEmpathy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
