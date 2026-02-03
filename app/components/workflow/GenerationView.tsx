'use client';

import React, { useEffect } from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const GenerationView: React.FC = () => {
  const {
    prompt,
    selectedStyle,
    generatedImage,
    setGeneratedImage,
    isGenerating,
    setIsGenerating,
    setCurrentStep
  } = useMotionStore();
  
  // Mock image generation
  useEffect(() => {
    if (!generatedImage && !isGenerating) {
      setIsGenerating(true);
      
      // Simulate API call
      setTimeout(() => {
        setGeneratedImage({
          id: Date.now().toString(),
          url: `https://picsum.photos/seed/${Date.now()}/800/600`,
          prompt: prompt,
          style: selectedStyle,
          timestamp: new Date()
        });
        setIsGenerating(false);
      }, 2000);
    }
  }, [generatedImage, isGenerating, prompt, selectedStyle, setGeneratedImage, setIsGenerating]);
  
  const handleContinue = () => {
    setCurrentStep('animation');
  };
  
  const handleBack = () => {
    setCurrentStep('style');
  };
  
  const handleRegenerate = () => {
    setGeneratedImage(null);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          {isGenerating ? 'Generating Your Image...' : 'Image Generated!'}
        </h2>
        <p className="text-gray-400">
          {isGenerating ? 'Please wait while we create your image' : 'Review your generated image'}
        </p>
      </div>
      
      <Card className="p-6 mb-6">
        {/* Image Preview */}
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Generating image...</p>
            </div>
          ) : generatedImage ? (
            <img
              src={generatedImage.url}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        
        {/* Image Details */}
        {generatedImage && !isGenerating && (
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-400">Prompt:</span>
              <p className="text-white">{generatedImage.prompt}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Style:</span>
              <p className="text-white capitalize">{generatedImage.style}</p>
            </div>
          </div>
        )}
      </Card>
      
      {!isGenerating && generatedImage && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleBack}>
              ← Back to Style
            </Button>
            <Button variant="secondary" onClick={handleRegenerate}>
              Regenerate
            </Button>
          </div>
          <Button onClick={handleContinue} size="lg">
            Add Animation →
          </Button>
        </div>
      )}
    </div>
  );
};