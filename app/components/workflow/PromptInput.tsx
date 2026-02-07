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
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          Describe Your <span className="text-electric-blue text-glow">Vision</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Enter a text prompt to generate your image. Be as descriptive as possible for the best results.
        </p>
      </div>

      <Card className="p-1">
        <div className="p-8 space-y-6">
          <textarea
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            placeholder="A majestic dragon soaring through neon clouds in a synthwave sky..."
            className="w-full h-40 px-6 py-5 bg-obsidian border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue/50 resize-none transition-all text-lg leading-relaxed shadow-inner"
          />

          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-slate-500">
                <span className={`h-2 w-2 rounded-full ${localPrompt.length > 0 ? 'bg-electric-blue' : 'bg-slate-700'}`} />
                <span className="text-sm font-medium">
                  {localPrompt.length} characters
                </span>
              </div>
              <button
                onClick={() => {
                  const voidKeywords = ['Obsidian void style', 'volumetric shadows', 'electric blue highlights', 'highly detailed 8k', 'cinematic composition', 'dark synthwave aesthetic'];
                  const refined = `${localPrompt} ${voidKeywords.join(', ')}`;
                  setLocalPrompt(refined);
                }}
                className="text-[10px] font-bold text-electric-blue hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center space-x-2 group"
              >
                <span className="group-hover:animate-pulse">✧ Neural Enhancement</span>
              </button>
            </div>
            <Button
              onClick={handleContinue}
              disabled={!localPrompt.trim()}
              size="lg"
            >
              Select Your Style →
            </Button>
          </div>
        </div>
      </Card>

      {/* Example Prompts */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Inspiration
          </h3>
          <div className="h-[1px] flex-grow bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examplePrompts.map((example, index) => (
            <Card
              key={index}
              className="p-1 group"
              onClick={() => setLocalPrompt(example)}
            >
              <div className="p-4 flex items-start space-x-4">
                <div className="mt-1 h-5 w-5 rounded bg-electric-blue/10 flex items-center justify-center text-electric-blue text-[10px] font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                  {example}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};