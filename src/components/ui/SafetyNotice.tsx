'use client'

import { ShieldAlert } from 'lucide-react'

interface SafetyNoticeProps {
  message: string
  onReset: () => void
}

export function SafetyNotice({ message, onReset }: SafetyNoticeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 text-center max-w-2xl mx-auto min-h-[50vh] animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">Your safety is important</h3>
      
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 text-left w-full shadow-sm">
        <p className="text-slate-700 mb-4 font-medium">{message}</p>
        <p className="text-slate-600 mb-4">
          This sounds more serious than a normal misunderstanding. Your safety matters more than resolving the conversation right now. Please consider reaching out to:
        </p>
        <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-2">
          <li>A trusted adult or friend</li>
          <li>Parent or guardian</li>
          <li>School counselor</li>
          <li>Emergency services (in case of immediate danger)</li>
        </ul>
      </div>
      
      <button
        onClick={onReset}
        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
      >
        Start a different conversation
      </button>
    </div>
  )
}
