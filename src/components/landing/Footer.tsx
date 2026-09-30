'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
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
              “Understanding someone doesn’t mean agreeing with them.”
            </p>
            <p className="text-xs text-stone-500 leading-relaxed font-normal">
              An empathetic AI communication mediator built to help people navigate misunderstandings
              privately without taking sides.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-3">
              <span className="font-semibold text-stone-900 uppercase tracking-wider block">
                Product
              </span>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <button
                    onClick={() => scrollTo('how-it-works')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('demonstration')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    Demonstration
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('outcomes')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    Outcomes
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-semibold text-stone-900 uppercase tracking-wider block">
                Trust &amp; Safety
              </span>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <button
                    onClick={() => scrollTo('privacy')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    Privacy Architecture
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('faq')}
                    className="hover:text-stone-900 cursor-pointer"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <Link href="/about" className="hover:text-stone-900">
                    Mission &amp; Vision
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="font-semibold text-stone-900 uppercase tracking-wider block">
                Safety Note
              </span>
              <p className="text-stone-500 leading-relaxed text-[11px]">
                Not a crisis service or therapy provider. If you are in acute distress or immediate
                danger, please reach out directly to India emergency services (112) or Tele-MANAS (14416).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Reconcile AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Confidential Two-Sided Mediation</span>
            <span>Zero Data Monetization</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
