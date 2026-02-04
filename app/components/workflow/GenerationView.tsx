'use client';

import React, { useState } from 'react';
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
  
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage({
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: prompt,
        style: selectedStyle,
        timestamp: new Date()
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on mount if no image exists
  React.useEffect(() => {
    if (!generatedImage && !isGenerating && !error) {
      generateImage();
    }
  }, []);

  const handleContinue = () => {
    setCurrentStep('animation');
  };
  
  const handleBack = () => {
    setCurrentStep('style');
  };
  
  const handleRegenerate = () => {
    setGeneratedImage(null);
    setError(null);
    generateImage();
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          {isGenerating ? 'Generating Your Image...' : error ? 'Generation Failed' : 'Image Generated!'}
        </h2>
        <p className="text-gray-400">
          {isGenerating 
            ? 'This may take 10-30 seconds depending on server load' 
            : error 
            ? 'Please try again' 
            : 'Review your generated image'}
        </p>
      </div>
      
      <Card className="p-6 mb-6">
        {/* Image Preview */}
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Generating image...</p>
              <p className="text-sm text-gray-500 mt-2">This usually takes 10-30 seconds</p>
            </div>
          ) : error ? (
            <div className="text-center px-4">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-400 mb-2">{error}</p>
              <p className="text-sm text-gray-500">
                {error.includes('loading') 
                  ? 'The model is warming up. Please wait a moment and try again.'
                  : 'Check your API key and try again.'}
              </p>
            </div>
          ) : generatedImage ? (
            <img
              src={generatedImage.url}
              alt="Generated"
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>
        
        {/* Image Details */}
        {generatedImage && !isGenerating && !error && (
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
      
      {!isGenerating && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleBack}>
              ← Back to Style
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              Regenerate
            </Button>
          </div>
          {generatedImage && !error && (
            <Button onClick={handleContinue} size="lg">
              Add Animation →
            </Button>
          )}
        </div>
      )}
    </div>
  );
};