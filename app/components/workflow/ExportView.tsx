'use client';

import React from 'react';
import { useMotionStore } from '@/app/store/useMotionStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Slider } from '../ui/Slider';

export const ExportView: React.FC = () => {
  const {
    animatedPreview,
    exportSettings,
    setExportSettings,
    exportedGif,
    setExportedGif,
    isExporting,
    setIsExporting,
    reset,
    setCurrentStep
  } = useMotionStore();
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Mock export - in Phase 3 this will use FFmpeg
    setTimeout(() => {
      setExportedGif(animatedPreview);
      setIsExporting(false);
    }, 2000);
  };
  
  const handleDownload = () => {
    if (exportedGif) {
      // Mock download - in Phase 3 this will trigger actual download
      const link = document.createElement('a');
      link.href = exportedGif;
      link.download = `motion-frame-${Date.now()}.gif`;
      link.click();
    }
  };
  
  const handleStartOver = () => {
    reset();
  };
  
  const handleBack = () => {
    setCurrentStep('animation');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
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
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            {isExporting ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Exporting GIF...</p>
              </div>
            ) : exportedGif ? (
              <img
                src={exportedGif}
                alt="Exported GIF"
                className="w-full h-full object-cover"
              />
            ) : animatedPreview ? (
              <img
                src={animatedPreview}
                alt="Preview"
                className="w-full h-full object-cover opacity-50"
              />
            ) : null}
          </div>
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
              min={15}
              max={60}
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
            
            {!exportedGif && (
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? 'Exporting...' : 'Export GIF'}
              </Button>
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
          <Button variant="outline" onClick={handleBack}>
            ← Back to Animation
          </Button>
        </div>
      )}
    </div>
  );
};