import { create } from 'zustand';
import { AppState } from '../types';
import { DEFAULT_ANIMATION_SETTINGS, DEFAULT_EXPORT_SETTINGS } from '../lib/constants';

export const useMotionStore = create<AppState>((set) => ({
  // Workflow
  currentStep: 'prompt',
  setCurrentStep: (step) => set({ currentStep: step }),
  
  // Prompt & Style
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  selectedStyle: 'cinematic',
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  
  // Generated Images
  generatedImage: null,
  setGeneratedImage: (image) => set({ generatedImage: image }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  // Animation
  animationSettings: DEFAULT_ANIMATION_SETTINGS,
  setAnimationSettings: (settings) => set({ animationSettings: settings }),
  animatedPreview: null,
  setAnimatedPreview: (preview) => set({ animatedPreview: preview }),
  isAnimating: false,
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  
  // Export
  exportSettings: DEFAULT_EXPORT_SETTINGS,
  setExportSettings: (settings) => set({ exportSettings: settings }),
  exportedGif: null,
  setExportedGif: (gif) => set({ exportedGif: gif }),
  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),
  
  // Reset
  reset: () => set({
    currentStep: 'prompt',
    prompt: '',
    selectedStyle: 'cinematic',
    generatedImage: null,
    isGenerating: false,
    animationSettings: DEFAULT_ANIMATION_SETTINGS,
    animatedPreview: null,
    isAnimating: false,
    exportSettings: DEFAULT_EXPORT_SETTINGS,
    exportedGif: null,
    isExporting: false
  })
}));