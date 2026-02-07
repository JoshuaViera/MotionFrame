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
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          {isGenerating ? (
            <>Forging Your <span className="text-electric-blue text-glow">Masterpiece</span></>
          ) : error ? (
            <span className="text-red-500">Generation Failed</span>
          ) : (
            <>Visual <span className="text-electric-blue text-glow">Complete</span></>
          )}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {isGenerating
            ? 'Our AI is weaving pixels into reality. This usually takes 10-30 seconds.'
            : error
              ? 'We encountered a hiccup. Please check the details below.'
              : 'Your vision has been materialized. Review the result before adding motion.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Canvas */}
        <div className="lg:col-span-2">
          <Card className="aspect-square relative overflow-hidden flex items-center justify-center bg-obsidian border-white/5">
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-electric-blue/20 rounded-full animate-ping absolute inset-0" />
                  <div className="w-24 h-24 border-t-4 border-electric-blue rounded-full animate-spin relative" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-white font-bold tracking-widest uppercase text-sm">Synthesizing</p>
                  <p className="text-slate-500 text-xs animate-pulse">Wait for perfection...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center p-8 space-y-6">
                <div className="h-20 w-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center text-red-500 text-4xl">
                  ⚠️
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold">{error}</p>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    {error.includes('loading')
                      ? 'The AI model is currently warming up. This happens after periods of inactivity.'
                      : 'Ensure your configuration is correct or try a different prompt.'}
                  </p>
                </div>
                <Button variant="outline" onClick={handleRegenerate} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  Retry Generation
                </Button>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full group">
                <img
                  src={generatedImage.url}
                  alt="Generated Masterpiece"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-white">
                  <p className="text-xs font-bold text-electric-blue uppercase tracking-widest mb-1">Generated Result</p>
                  <p className="text-sm line-clamp-2 italic text-slate-300">"{generatedImage.prompt}"</p>
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 bg-glass">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Metadata</h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Input Prompt</span>
                <p className="text-sm text-white leading-relaxed line-clamp-4">{prompt}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Style</span>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-electric-blue" />
                  <p className="text-sm text-white capitalize">{selectedStyle}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                <p className={`text-sm font-semibold ${isGenerating ? 'text-electric-blue animate-pulse' : error ? 'text-red-400' : 'text-green-400'}`}>
                  {isGenerating ? 'Processing...' : error ? 'Error' : 'Ready'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-glass">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-400">
                <span className="text-lg">💡</span>
                <h4 className="text-xs font-bold uppercase tracking-wider">Pro Tip</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the perspective feels off, try adding "symmetrical" or "centered" to your prompt.
              </p>
            </div>
          </Card>

          {!isGenerating && (
            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={handleContinue} disabled={!generatedImage || !!error}>
                Add Motion Effects →
              </Button>
              <div className="flex space-x-3">
                <Button variant="secondary" className="flex-1" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="secondary" className="flex-1" onClick={handleRegenerate}>
                  Redo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};