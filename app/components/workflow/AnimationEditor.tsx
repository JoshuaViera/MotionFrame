'use client';

import React from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';
import { ANIMATION_TYPES } from '@/app/lib/constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';
import { AnimationType } from '@/app/types';

export const AnimationEditor: React.FC = () => {
  const {
    generatedImage,
    animationSettings,
    setAnimationSettings,
    animatedPreview,
    setAnimatedPreview,
    setCurrentStep,
    isCinematicMode,
    setIsCinematicMode
  } = useMotionStore();

  const handleApplyAnimation = () => {
    // Mock animated preview - in Phase 2 this will use FFmpeg
    setAnimatedPreview(generatedImage?.url || null);
  };

  const handleContinue = () => {
    if (animatedPreview) {
      setCurrentStep('export');
    }
  };

  const handleBack = () => {
    setCurrentStep('generation');
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-12 py-8 transition-opacity duration-700 ${isCinematicMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          Breathe <span className="text-electric-blue text-glow">Life</span> into Art
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Add sophisticated motion patterns to your generated image. Fine-tune duration and intensity for the perfect flow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preview Canvas */}
        <div className={`lg:col-span-8 transition-all duration-1000 ${isCinematicMode ? 'fixed inset-0 z-50 lg:col-span-12 m-0 rounded-none' : ''}`}>
          <Card className={`aspect-video relative overflow-hidden bg-obsidian border-white/5 shadow-2xl transition-all duration-1000 ${isCinematicMode ? 'h-screen w-screen rounded-none' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {animatedPreview || generatedImage ? (
                <div className={`w-full h-full relative overflow-hidden ${animatedPreview
                  ? (animationSettings.type === 'zoom'
                    ? 'animate-pulse'
                    : animationSettings.type === 'hallucination'
                      ? 'animate-glitch'
                      : 'animate-bounce')
                  : ''
                  }`}>
                  <img
                    src={animatedPreview || generatedImage?.url}
                    alt="Motion Preview"
                    className={`w-full h-full object-cover transition-all duration-[var(--duration)] ease-in-out ${animatedPreview
                      ? (animationSettings.type === 'zoom'
                        ? 'scale-125'
                        : animationSettings.type === 'hallucination'
                          ? 'scale-150 hallucination-filter'
                          : 'translate-x-4 scale-110')
                      : 'scale-100'
                      }`}
                    style={{
                      '--duration': `${animationSettings.duration}s`,
                      filter: animatedPreview
                        ? (animationSettings.type === 'hallucination'
                          ? `hue-rotate(${animationSettings.intensity * 3.6}deg) contrast(${100 + animationSettings.intensity}%)`
                          : `blur(${100 - animationSettings.intensity}px)`)
                        : 'none'
                    } as React.CSSProperties}
                  />
                  {/* Overlay for "Applied" feel */}
                  {animatedPreview && (
                    <div className={`absolute inset-0 pointer-events-none ${animationSettings.type === 'hallucination'
                      ? 'bg-electric-blue/20 mix-blend-overlay animate-rgb'
                      : 'bg-electric-blue/5'
                      }`} />
                  )}
                </div>
              ) : (
                <div className="text-slate-600 flex flex-col items-center space-y-4">
                  <span className="text-6xl text-slate-800">🖼️</span>
                  <p className="font-bold uppercase tracking-widest text-xs">No Image Loaded</p>
                </div>
              )}
            </div>

            {/* Action Bar Overlay */}
            <div className={`absolute bottom-6 left-6 right-6 flex justify-between items-center bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 z-50 transition-all ${isCinematicMode ? 'bottom-20 max-w-sm mx-auto' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${animatedPreview ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {animatedPreview ? 'Motion Applied' : 'Awaiting Configuration'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="secondary" onClick={() => setIsCinematicMode(!isCinematicMode)}>
                  {isCinematicMode ? 'Exit Cinematic' : 'Cinematic View'}
                </Button>
                <Button size="sm" variant="secondary" onClick={handleApplyAnimation}>
                  {animatedPreview ? 'Refresh Preview' : 'Apply Motion'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 space-y-8 bg-glass border-electric-blue/10">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Physics</h3>
              <p className="text-white font-bold text-xl">Motion Engine</p>
            </div>

            <div className="space-y-8">
              {/* Animation Type */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Select Pattern</label>
                <div className="grid grid-cols-2 gap-3">
                  {ANIMATION_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setAnimationSettings({ ...animationSettings, type: type.value as AnimationType })}
                      className={`px-4 py-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${animationSettings.type === type.value
                        ? 'border-electric-blue bg-electric-blue/10 text-electric-blue shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                        : 'border-white/5 bg-white/2 text-slate-400 hover:border-white/10 hover:bg-white/5'
                        }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-obsidian rounded-xl border border-white/5">
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    {ANIMATION_TYPES.find(t => t.value === animationSettings.type)?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Duration</label>
                    <span className="text-sm font-black text-white">{animationSettings.duration}<span className="text-slate-500 ml-0.5">s</span></span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={animationSettings.duration}
                    onChange={(e) => setAnimationSettings({ ...animationSettings, duration: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                </div>

                {/* Intensity */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Intensity</label>
                    <span className="text-sm font-black text-white">{animationSettings.intensity}<span className="text-slate-500 ml-0.5">%</span></span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={animationSettings.intensity}
                    onChange={(e) => setAnimationSettings({ ...animationSettings, intensity: parseInt(e.target.value) })}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              disabled={!animatedPreview}
              className="w-full"
              size="lg"
            >
              Finalize & Export →
            </Button>
            <Button variant="secondary" onClick={handleBack} className="w-full">
              Back to Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};