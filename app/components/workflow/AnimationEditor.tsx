'use client';

import React, { useState, useMemo } from 'react';
import { useMotionStore } from '@/store/useMotionStore';
import { ANIMATION_TYPES } from '@/lib/constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';
import { AnimationType } from '@/types';

export const AnimationEditor: React.FC = () => {
  const {
    generatedImage,
    animationSettings,
    setAnimationSettings,
    setAnimatedPreview,
    setCurrentStep
  } = useMotionStore();
  
  const [previewKey, setPreviewKey] = useState(0);
  
  // Generate CSS animation styles based on settings
  const animationStyles = useMemo(() => {
    const duration = animationSettings.duration;
    const intensity = animationSettings.intensity / 100;
    
    if (animationSettings.type === 'zoom') {
      // Ken Burns zoom effect
      const maxScale = 1 + (intensity * 0.5); // 1.0 to 1.5 based on intensity
      return {
        animation: `zoomEffect ${duration}s ease-in-out infinite alternate`,
        '--zoom-scale': maxScale,
      } as React.CSSProperties;
    } else {
      // Drift/pan effect
      const maxDrift = intensity * 10; // 0 to 10% based on intensity
      return {
        animation: `driftEffect ${duration}s ease-in-out infinite alternate`,
        '--drift-amount': `${maxDrift}%`,
      } as React.CSSProperties;
    }
  }, [animationSettings.type, animationSettings.duration, animationSettings.intensity]);
  
  // Reset animation when settings change
  const handleSettingsChange = (newSettings: typeof animationSettings) => {
    setAnimationSettings(newSettings);
    setPreviewKey(prev => prev + 1); // Force animation restart
  };
  
  const handleContinue = () => {
    // Mark that we have animation settings ready (no actual GIF yet)
    // The export step will generate the real GIF
    setAnimatedPreview('pending');
    setCurrentStep('export');
  };
  
  const handleBack = () => {
    setCurrentStep('generation');
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes zoomEffect {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(var(--zoom-scale, 1.2));
          }
        }
        
        @keyframes driftEffect {
          0% {
            transform: translateX(calc(var(--drift-amount, 5%) * -1)) scale(1.1);
          }
          100% {
            transform: translateX(var(--drift-amount, 5%)) scale(1.1);
          }
        }
      `}</style>
      
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          Animate Your Image
        </h2>
        <p className="text-gray-400">
          Add motion effects to bring your image to life
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center relative">
              {generatedImage ? (
                <div className="w-full h-full overflow-hidden">
                  <img
                    key={previewKey}
                    src={generatedImage.url}
                    alt="Animation preview"
                    className="w-full h-full object-cover"
                    style={animationStyles}
                  />
                </div>
              ) : (
                <span className="text-gray-500">No image</span>
              )}
              
              {generatedImage && (
                <div className="absolute top-2 right-2 bg-electric-blue text-dark px-3 py-1 rounded-full text-xs font-semibold">
                  Live Preview
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-400 text-center">
              This is a live CSS preview. The actual GIF will be generated on export.
            </p>
          </Card>
        </div>
        
        {/* Controls */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Animation Settings
            </h3>
            
            <div className="space-y-6">
              {/* Animation Type */}
              <Select
                label="Animation Type"
                options={ANIMATION_TYPES.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
                value={animationSettings.type}
                onChange={(value) =>
                  handleSettingsChange({
                    ...animationSettings,
                    type: value as AnimationType
                  })
                }
              />
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  {ANIMATION_TYPES.find(t => t.value === animationSettings.type)?.description}
                </p>
              </div>
              
              {/* Duration */}
              <Slider
                label="Duration"
                value={animationSettings.duration}
                onChange={(value) =>
                  handleSettingsChange({
                    ...animationSettings,
                    duration: value
                  })
                }
                min={1}
                max={10}
                step={0.5}
                unit="s"
              />
              
              {/* Intensity */}
              <Slider
                label="Intensity"
                value={animationSettings.intensity}
                onChange={(value) =>
                  handleSettingsChange({
                    ...animationSettings,
                    intensity: value
                  })
                }
                min={0}
                max={100}
                step={5}
                unit="%"
              />
              
              {/* Frame count info */}
              <div className="text-xs text-gray-500 bg-gray-900 p-3 rounded-lg">
                <p>Estimated output: {Math.floor(animationSettings.duration * 15)} frames @ 15fps</p>
                <p className="mt-1">GIF will be generated when you click "Export GIF"</p>
              </div>
              
              {/* Preview info */}
              <div className="bg-electric-blue/10 border border-electric-blue/30 rounded-lg p-4">
                <p className="text-sm text-electric-blue">
                  ✨ Adjust settings above to see the animation effect in real-time!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handleBack}>
          ← Back to Generation
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!generatedImage}
          size="lg"
        >
          Export GIF →
        </Button>
      </div>
    </div>
  );
};