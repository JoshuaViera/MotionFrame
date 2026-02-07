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
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          {exportedGif ? (
            <><span className="text-electric-blue text-glow">Masterpiece</span> Forged</>
          ) : (
            <>Ready for <span className="text-electric-blue text-glow">Arrival</span></>
          )}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {exportedGif
            ? 'Your animated capture is ready for the world. Download it now or start a new vision.'
            : 'Configure your final output parameters. We recommend 30fps for smooth motion.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preview Canvas */}
        <div className="lg:col-span-12 xl:col-span-8">
          <Card className="aspect-video relative overflow-hidden bg-obsidian border-white/5 shadow-2xl flex items-center justify-center">
            {isExporting ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-electric-blue/10 rounded-full animate-ping absolute inset-0" />
                  <div className="w-20 h-20 border-t-4 border-electric-blue rounded-full animate-spin relative" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-white font-bold tracking-widest uppercase text-xs">Compiling Artifact</p>
                  <p className="text-slate-500 text-[10px] animate-pulse uppercase tracking-[0.2em]">Writing to Obsidian Buffer...</p>
                </div>
              </div>
            ) : exportedGif ? (
              <div className="relative w-full h-full">
                <img
                  src={exportedGif}
                  alt="Final Exported GIF"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex items-center space-x-2 bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-500/30">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Optimized & Saved</span>
                </div>
              </div>
            ) : animatedPreview ? (
              <div className="relative w-full h-full opacity-40">
                <img
                  src={animatedPreview}
                  alt="Preview before export"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-obsidian/20">
                  <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Ready for Encoding</p>
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <Card className="p-8 space-y-8 bg-glass border-electric-blue/10">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Encoding</h3>
              <p className="text-white font-bold text-xl">Export Engine</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Format</label>
                <div className="bg-obsidian border border-white/5 px-4 py-3 rounded-xl flex justify-between items-center">
                  <span className="text-white font-bold text-sm tracking-widest">GIF</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Legacy Support</span>
                </div>
              </div>

              <div className="space-y-8">
                {/* FPS */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Frame Rate</label>
                    <span className="text-sm font-black text-white">{exportSettings.fps}<span className="text-slate-500 ml-0.5 text-xs">fps</span></span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={60}
                    step={5}
                    value={exportSettings.fps}
                    onChange={(e) => setExportSettings({ ...exportSettings, fps: parseInt(e.target.value) })}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                </div>

                {/* Quality */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quality</label>
                    <span className="text-sm font-black text-white">{exportSettings.quality}<span className="text-slate-500 ml-0.5 text-xs">%</span></span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={10}
                    value={exportSettings.quality}
                    onChange={(e) => setExportSettings({ ...exportSettings, quality: parseInt(e.target.value) })}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  />
                </div>
              </div>

              {!exportedGif && (
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full"
                  size="lg"
                >
                  {isExporting ? 'Encoding Art...' : 'Initiate Export'}
                </Button>
              )}
            </div>
          </Card>

          {exportedGif ? (
            <div className="space-y-3">
              <Button onClick={handleDownload} className="w-full" size="lg">
                Download Artifact
              </Button>
              <Button variant="secondary" onClick={handleStartOver} className="w-full">
                Create Anew
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={handleBack} className="w-full">
              Adjust Motion
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};