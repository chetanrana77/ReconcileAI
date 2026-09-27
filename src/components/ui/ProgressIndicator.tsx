'use client'

import { AppStep } from '@/lib/types'
import { Check } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ProgressIndicatorProps {
  currentStep: AppStep
}

const STEPS = [
  { id: 'relationship', label: 'Who' },
  { id: 'input', label: 'What Happened' },
  { id: 'processing', label: 'Analyzing' },
  { id: 'results', label: 'Results' }
] as const

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  if (currentStep === 'landing') return null

  const currentIndex = STEPS.findIndex(step => step.id === currentStep)
  
  if (currentIndex === -1) return null

  return (
    <div className="w-full max-w-md mx-auto pt-4 pb-12">
      <div className="flex items-center justify-between relative">
        {/* Background track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0" />
        
        {/* Active track */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={twMerge(
                  clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 shadow-sm border-2",
                    isCompleted ? "bg-indigo-600 border-indigo-600 text-white" :
                    isCurrent ? "bg-white border-indigo-600 text-indigo-600" :
                    "bg-white border-slate-200 text-slate-400"
                  )
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span 
                className={clsx(
                  "absolute top-10 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                  isCurrent || isCompleted ? "text-slate-800" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
