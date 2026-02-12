'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useMotionStore } from '@/store/useMotionStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Slider } from '../ui/Slider';
import {
  generateAnimationFrames,
  AnimationConfig
} from '@/lib/animation';
import {
  renderAllFrames,
  estimateOutputDimensions
} from '@/lib/frameRenderer';
import {
  framesToGif,
  loadFFmpeg,
  estimateGifSize
} from '@/lib/ffmpegExporter';
import { calculateExportCost, formatCost } from '@/lib/pricing';

export const ExportView: React.FC = () => {
  const {
    generatedImage,
    animationSettings,
    exportSettings,
    setExportSettings,
    exportedGif,
    setExportedGif,
    isExporting,
    setIsExporting,
    reset,
    setCurrentStep,
    // Usage tracking
    creditBalance,
    recordTransaction
  } = useMotionStore();
  
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  
  // CSS animation styles for preview (same as AnimationEditor)
  const animationStyles = useMemo(() => {
    const duration = animationSettings.duration;
    const intensity = animationSettings.intensity / 100;
    
    if (animationSettings.type === 'zoom') {
      const maxScale = 1 + (intensity * 0.5);
      return {
        animation: `zoomEffect ${duration}s ease-in-out infinite alternate`,
        '--zoom-scale': maxScale,
      } as React.CSSProperties;
    } else {
      const maxDrift = intensity * 10;
      return {
        animation: `driftEffect ${duration}s ease-in-out infinite alternate`,
        '--drift-amount': `${maxDrift}%`,
      } as React.CSSProperties;
    }
  }, [animationSettings.type, animationSettings.duration, animationSettings.intensity]);

  // Load gif.js on mount
  useEffect(() => {
    loadFFmpeg().catch(err => {
      console.error('Failed to load GIF encoder:', err);
    });
  }, []);
  
  // Calculate estimated file size and cost
  useEffect(() => {
    if (generatedImage) {
      estimateOutputDimensions(generatedImage.url).then(dimensions => {
        const frameCount = Math.floor(animationSettings.duration * exportSettings.fps);
        const size = estimateGifSize(
          frameCount,
          dimensions.width,
          dimensions.height,
          exportSettings.quality
        );
        setEstimatedSize(size);

        // Calculate export cost
        const cost = calculateExportCost({
          duration: animationSettings.duration,
          resolution: '720p',
          fps: exportSettings.fps,
          effectType: animationSettings.type === 'zoom' ? 'kenburns' : 'drift'
        });
        setEstimatedCost(cost);
      });
    }
  }, [generatedImage, animationSettings.duration, animationSettings.type, exportSettings.fps, exportSettings.quality]);
  
  const handleExport = async () => {
    if (!generatedImage) {
      setError('No image to export');
      return;
    }

    // Check balance before starting export
    if (creditBalance < estimatedCost) {
      setError(
        `Insufficient balance. This export costs ${formatCost(estimatedCost)}. Current balance: ${formatCost(creditBalance)}`
      );
      return;
    }
    
    setIsExporting(true);
    setError(null);
    setProgress(0);
    setProgressMessage('Preparing export...');
    
    try {
      // Step 1: Generate animation frames data
      setProgressMessage('Calculating animation frames...');
      const animConfig: AnimationConfig = {
        type: animationSettings.type,
        duration: animationSettings.duration,
        intensity: animationSettings.intensity,
        fps: exportSettings.fps
      };
      
      const frames = generateAnimationFrames(animConfig);
      setProgress(5);
      
      // Step 2: Estimate output dimensions
      setProgressMessage('Analyzing image...');
      const dimensions = await estimateOutputDimensions(generatedImage.url);
      setProgress(10);
      
      // Step 3: Render frames with transforms
      setProgressMessage(`Rendering ${frames.length} frames...`);
      const renderedFrames = await renderAllFrames(
        generatedImage.url,
        frames,
        {
          width: Math.min(dimensions.width, 720),
          height: Math.min(dimensions.height, 720),
          quality: exportSettings.quality
        },
        (current, total) => {
          const frameProgress = 10 + (current / total) * 40;
          setProgress(Math.round(frameProgress));
          setProgressMessage(`Rendering frame ${current} of ${total}...`);
        }
      );
      
      // Step 4: Convert to GIF
      setProgressMessage('Creating GIF...');
      const gifBlob = await framesToGif(
        renderedFrames,
        {
          fps: exportSettings.fps,
          quality: exportSettings.quality
        },
        (gifProgress) => {
          const totalProgress = 50 + (gifProgress / 100) * 50;
          setProgress(Math.round(totalProgress));
          setProgressMessage('Encoding GIF...');
        }
      );
      
      // Step 5: Create object URL
      const gifUrl = URL.createObjectURL(gifBlob);
      setExportedGif(gifUrl);
      
      setProgress(100);
      setProgressMessage('Export complete!');

      // Record transaction after successful export
      try {
        await recordTransaction({
          actionType: 'export',
          actionDetails: `GIF Export - ${animationSettings.duration}s at ${exportSettings.fps}fps`,
          cost: estimatedCost,
          metadata: {
            duration: animationSettings.duration,
            fps: exportSettings.fps,
            quality: exportSettings.quality,
            animationType: animationSettings.type,
            frames: frames.length
          }
        });
        console.log('✅ Export transaction recorded:', formatCost(estimatedCost));
      } catch (txError) {
        console.error('Failed to record transaction:', txError);
        // Don't block the user if transaction recording fails
      }
      
      // Clear progress after 2 seconds
      setTimeout(() => {
        setProgressMessage('');
        setProgress(0);
      }, 2000);
      
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Failed to export GIF');
      setProgress(0);
      setProgressMessage('');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDownload = () => {
    if (exportedGif) {
      const link = document.createElement('a');
      link.href = exportedGif;
      link.download = `motionframe-${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleStartOver = () => {
    // Cleanup object URLs
    if (exportedGif && exportedGif.startsWith('blob:')) {
      URL.revokeObjectURL(exportedGif);
    }
    reset();
  };
  
  const handleBack = () => {
    setCurrentStep('animation');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (exportedGif && exportedGif.startsWith('blob:')) {
        URL.revokeObjectURL(exportedGif);
      }
    };
  }, [exportedGif]);
  
  return (
    <div className="max-w-4xl mx-auto">
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
          {exportedGif ? 'Export Complete!' : 'Export Your Animation'}
        </h2>
        <p className="text-gray-400">
          {exportedGif
            ? 'Your animated GIF is ready to download'
            : 'Configure export settings and generate your GIF'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Preview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative">
            {isExporting ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">{progressMessage}</p>
                <div className="mt-4 w-64 bg-gray-800 rounded-full h-2 mx-auto">
                  <div
                    className="bg-electric-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}%</p>
              </div>
            ) : exportedGif ? (
              <img
                src={exportedGif}
                alt="Exported GIF"
                className="w-full h-full object-contain"
              />
            ) : generatedImage ? (
              <div className="w-full h-full overflow-hidden">
                <img
                  src={generatedImage.url}
                  alt="Animation preview"
                  className="w-full h-full object-cover"
                  style={animationStyles}
                />
              </div>
            ) : null}
            
            {exportedGif && !isExporting && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Ready
              </div>
            )}
            
            {!exportedGif && !isExporting && generatedImage && (
              <div className="absolute top-2 right-2 bg-electric-blue text-dark px-3 py-1 rounded-full text-xs font-semibold">
                Live Preview
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </Card>
        
        {/* Export Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Export Settings
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <div className="bg-gray-900 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">GIF</span>
              </div>
            </div>
            
            <Slider
              label="Frame Rate"
              value={exportSettings.fps}
              onChange={(value) =>
                setExportSettings({
                  ...exportSettings,
                  fps: value
                })
              }
              min={10}
              max={30}
              step={5}
              unit=" fps"
            />
            
            <Slider
              label="Quality"
              value={exportSettings.quality}
              onChange={(value) =>
                setExportSettings({
                  ...exportSettings,
                  quality: value
                })
              }
              min={50}
              max={100}
              step={10}
              unit="%"
            />
            
            {/* Export Info */}
            <div className="bg-gray-900 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{animationSettings.duration}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Frames:</span>
                <span className="text-white">
                  {Math.floor(animationSettings.duration * exportSettings.fps)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Est. File Size:</span>
                <span className="text-white">{estimatedSize}</span>
              </div>
              {/* Show estimated cost */}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-800">
                <span className="text-gray-400">Export Cost:</span>
                <span className="text-electric-blue font-semibold">
                  {formatCost(estimatedCost)}
                </span>
              </div>
            </div>
            
            {!exportedGif && (
              <div className="space-y-3">
                <Button
                  onClick={handleExport}
                  disabled={isExporting || creditBalance < estimatedCost}
                  className="w-full"
                >
                  {isExporting 
                    ? 'Exporting...' 
                    : creditBalance < estimatedCost 
                    ? 'Insufficient Balance' 
                    : `Export GIF (${formatCost(estimatedCost)})`}
                </Button>
                {creditBalance < estimatedCost && (
                  <p className="text-xs text-red-400 text-center">
                    Need {formatCost(estimatedCost - creditBalance)} more credits
                  </p>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Export may take 30-60 seconds
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {exportedGif ? (
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={handleStartOver}>
            Create Another
          </Button>
          <Button onClick={handleDownload} size="lg">
            Download GIF
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={isExporting}>
            ← Back to Animation
          </Button>
        </div>
      )}
    </div>
  );
};