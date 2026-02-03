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
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          Choose Your Style
        </h2>
        <p className="text-gray-400">
          Select an artistic style for your image
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {STYLE_PRESETS.map((style) => (
          <Card
            key={style.value}
            selected={selectedStyle === style.value}
            onClick={() => setSelectedStyle(style.value)}
            className="p-6 cursor-pointer"
          >
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {style.label}
            </h3>
            <p className="text-sm text-gray-400">
              {style.description}
            </p>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBack}>
          ← Back to Prompt
        </Button>
        <Button onClick={handleContinue} size="lg">
          Generate Image →
        </Button>
      </div>
    </div>
  );
};