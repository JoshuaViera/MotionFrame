'use client';

import React from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';
import { STYLE_PRESETS } from '@/app/lib/constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const StyleSelector: React.FC = () => {
  const { selectedStyle, setSelectedStyle, setCurrentStep } = useMotionStore();

  const handleContinue = () => {
    setCurrentStep('generation');
  };

  const handleBack = () => {
    setCurrentStep('prompt');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          Select Your <span className="text-electric-blue text-glow">Aesthetic</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Choose a visual style that matches your vision. Each style uses optimized prompt modifiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STYLE_PRESETS.map((style) => (
          <Card
            key={style.value}
            selected={selectedStyle === style.value}
            onClick={() => setSelectedStyle(style.value)}
            className="p-1 group cursor-pointer"
          >
            <div className="p-6 space-y-4">
              <div className="relative aspect-video bg-obsidian rounded-xl overflow-hidden group-hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all border border-white/5 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent opacity-50" />
                <span className="text-5xl group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100">
                  {style.value === 'cinematic' && '🎬'}
                  {style.value === 'anime' && '🌸'}
                  {style.value === 'photorealistic' && '📸'}
                  {style.value === 'abstract' && '🎨'}
                  {style.value === 'retro' && '🕹️'}
                </span>
                {selectedStyle === style.value && (
                  <div className="absolute top-3 right-3 h-6 w-6 bg-electric-blue rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-obsidian" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="space-y-1 px-1">
                <h3 className="text-xl font-bold text-white group-hover:text-electric-blue transition-colors">
                  {style.label}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {style.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-8 flex justify-between items-center border-t border-white/5">
        <Button variant="secondary" onClick={handleBack}>
          ← Refine Prompt
        </Button>
        <Button onClick={handleContinue} size="lg">
          Generate Masterpiece →
        </Button>
      </div>
    </div>
  );
};