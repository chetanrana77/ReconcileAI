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
          <li><strong>India Emergency:</strong> Call <a href="tel:112" className="text-amber-700 font-bold underline">112</a> (Police, Medical, Fire)</li>
          <li><strong>Tele-MANAS (24/7 Govt. of India Helpline):</strong> Dial <a href="tel:14416" className="text-amber-700 font-bold underline">14416</a> or <a href="tel:18008914416" className="text-amber-700 font-bold underline">1800 891 4416</a></li>
          <li><strong>Vandrevala Foundation:</strong> Call or WhatsApp <a href="tel:+919999666555" className="text-amber-700 font-bold underline">+91 9999 666 555</a> (Free 24/7 counseling in Hindi, Marathi, English)</li>
          <li><strong>AASRA (Crisis &amp; Suicide Prevention):</strong> Call <a href="tel:+919820466726" className="text-amber-700 font-bold underline">+91 9820466726</a></li>
          <li>A trusted family member, elder, or school counselor</li>
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
