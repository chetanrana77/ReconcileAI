'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
  onDemo: () => void
}

export function ErrorState({ 
  message = "Hmm, I couldn't quite process that. Let's try again.", 
  onRetry, 
  onDemo 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto min-h-[50vh] animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-medium text-slate-800 mb-2">Something went wrong</h3>
      <p className="text-slate-600 mb-8">{message}</p>
      
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRetry}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
        >
          Try Again
        </button>
        <button
          onClick={onDemo}
          className="w-full bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 font-medium py-3 px-6 rounded-xl transition-colors"
        >
          Try a Demo Situation
        </button>
      </div>
    </div>
  )
}
