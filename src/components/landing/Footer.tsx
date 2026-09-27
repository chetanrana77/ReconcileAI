import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 mt-20 text-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Built with empathy</p>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Reconcile AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
