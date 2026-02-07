import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExportView = ({ assetName = "Untitled_Project" }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate the "GPU Oven" cooking the pixels
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExporting(false), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
      <h3 className="text-zinc-400 text-sm font-mono mb-2 uppercase tracking-widest">
        Digital Twin Export
      </h3>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{assetName}</h2>
        <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-500/30">
          RTX ENABLED
        </span>
      </div>

      {isExporting ? (
        <div className="space-y-4">
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-green-500"
            />
          </div>
          <p className="text-center text-zinc-500 font-mono text-xs animate-pulse">
            Searing Pixels... {progress}%
          </p>
        </div>
      ) : (
        <button
          onClick={handleExport}
          className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-green-400 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <span>DEPLOY TO OMNIVERSE</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ExportView;
