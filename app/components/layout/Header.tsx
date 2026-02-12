'use client';

import React from 'react';
import Link from 'next/link';
import { useMotionStore } from '@/store/useMotionStore';
import { Button } from '../ui/Button';
import { formatCost } from '@/lib/pricing';

export const Header: React.FC = () => {
  const { 
    currentStep, 
    reset,
    // NEW: Usage tracking
    creditBalance,
    isLoadingBalance
  } = useMotionStore();

  const steps = [
    { id: 'prompt', label: 'Prompt' },
    { id: 'style', label: 'Style' },
    { id: 'generation', label: 'Generate' },
    { id: 'animation', label: 'Animate' },
    { id: 'export', label: 'Export' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center">
              <span className="text-dark font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-white">MotionFrame</h1>
          </Link>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    index === currentStepIndex
                      ? 'bg-electric-blue text-dark'
                      : index < currentStepIndex
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-700" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* NEW: Balance Display + Actions */}
          <div className="flex items-center space-x-3">
            {/* Balance Widget */}
            <Link 
              href="/dashboard"
              className="hidden sm:flex items-center space-x-2 bg-gray-800 hover:bg-gray-750 px-4 py-2 rounded-lg transition-colors border border-gray-700"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">Balance:</span>
                <span className="text-white font-semibold">
                  {isLoadingBalance ? '...' : formatCost(creditBalance)}
                </span>
              </div>
            </Link>

            {/* Dashboard Link (Mobile) */}
            <Link href="/dashboard" className="sm:hidden">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>

            {/* Reset Button */}
            <Button variant="outline" size="sm" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-electric-blue">
              {steps[currentStepIndex].label}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-electric-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Mobile Balance */}
          <div className="mt-3 flex justify-between items-center text-sm">
            <span className="text-gray-400">Balance:</span>
            <Link href="/dashboard" className="text-white font-semibold hover:text-electric-blue">
              {isLoadingBalance ? '...' : formatCost(creditBalance)}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};