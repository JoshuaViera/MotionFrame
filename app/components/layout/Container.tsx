import React from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';
import { WorkflowStep } from '@/app/types';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const STEPS: { id: WorkflowStep; label: string }[] = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'style', label: 'Style' },
  { id: 'generation', label: 'Create' },
  { id: 'animation', label: 'Animate' },
  { id: 'export', label: 'Export' }
];

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  const { currentStep, reset } = useMotionStore();

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-void/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={reset}>
            <div className="h-10 w-10 bg-electric-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)] group-hover:scale-110 transition-transform">
              <span className="text-obsidian font-black text-xl">M</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              Motion<span className="text-electric-blue">Frame</span>
            </span>
          </div>

          {/* Progress Tracker */}
          <nav className="hidden md:flex items-center space-x-1">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${index === currentStepIndex
                    ? 'bg-electric-blue/10 text-electric-blue'
                    : index < currentStepIndex
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}>
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${index <= currentStepIndex ? 'border-electric-blue/50' : 'border-slate-700'
                    }`}>
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">{step.label}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-4 h-[1px] bg-white/5" />
                )}
              </React.Fragment>
            ))}
          </nav>

          <button
            onClick={reset}
            className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full ${className}`}>
        {children}
      </main>

      {/* Footer Decoration */}
      <footer className="py-8 text-center border-t border-white/5 opacity-20">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">
          Engineered for Obsidian Void
        </p>
      </footer>
    </div>
  );
};