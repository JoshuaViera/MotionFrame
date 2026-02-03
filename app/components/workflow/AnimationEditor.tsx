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
    setCurrentStep
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
    <div className="max-w-6xl mx-auto">
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
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              {animatedPreview ? (
                <img
                  src={animatedPreview}
                  alt="Animated preview"
                  className="w-full h-full object-cover"
                />
              ) : generatedImage ? (
                <img
                  src={generatedImage.url}
                  alt="Generated"
                  className="w-full h-full object-cover opacity-50"
                />
              ) : (
                <span className="text-gray-500">No image</span>
              )}
            </div>
            {!animatedPreview && (
              <p className="text-sm text-gray-400 text-center">
                Configure settings and click "Apply Animation" to preview
              </p>
            )}
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
                  setAnimationSettings({
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
                  setAnimationSettings({
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
                  setAnimationSettings({
                    ...animationSettings,
                    intensity: value
                  })
                }
                min={0}
                max={100}
                step={5}
                unit="%"
              />
              
              {/* Apply Button */}
              <Button
                onClick={handleApplyAnimation}
                className="w-full"
                variant="secondary"
              >
                Apply Animation
              </Button>
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
          disabled={!animatedPreview}
          size="lg"
        >
          Export GIF →
        </Button>
      </div>
    </div>
  );
};