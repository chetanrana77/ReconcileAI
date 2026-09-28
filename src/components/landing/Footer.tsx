import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 mt-20 text-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-3">
        <p className="text-base font-medium text-gray-700">
          Understanding someone doesn&apos;t mean agreeing with them.
        </p>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Reconcile AI &middot; No accounts. No data stored. Just clarity.
        </p>
      </div>
    </footer>
  );
}
