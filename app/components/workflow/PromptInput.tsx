'use client';

import React, { useState } from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const PromptInput: React.FC = () => {
  const { prompt, setPrompt, setCurrentStep } = useMotionStore();
  const [localPrompt, setLocalPrompt] = useState(prompt);
  
  const handleContinue = () => {
    if (localPrompt.trim()) {
      setPrompt(localPrompt);
      setCurrentStep('style');
    }
  };
  
  const examplePrompts = [
    'A serene lake surrounded by mountains at sunset',
    'Futuristic cityscape with neon lights and flying cars',
    'A magical forest with glowing mushrooms and fireflies',
    'Abstract geometric patterns in vibrant colors'
  ];
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-3">
          Describe Your Vision
        </h2>
        <p className="text-gray-400 text-lg">
          Enter a text prompt to generate your image
        </p>
      </div>
      
      <Card className="p-8 mb-6">
        <textarea
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          placeholder="A majestic dragon soaring through clouds..."
          className="w-full h-32 px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue resize-none transition-all"
        />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-400">
            {localPrompt.length} characters
          </span>
          <Button
            onClick={handleContinue}
            disabled={!localPrompt.trim()}
            size="lg"
          >
            Continue to Style Selection →
          </Button>
        </div>
      </Card>
      
      {/* Example Prompts */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Example Prompts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((example, index) => (
            <Card
              key={index}
              className="p-4 hover:bg-gray-700/50"
              onClick={() => setLocalPrompt(example)}
            >
              <p className="text-sm text-gray-300">{example}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};