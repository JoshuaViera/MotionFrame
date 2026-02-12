import { create } from 'zustand';
import { AppState } from '@/types';
import { DEFAULT_ANIMATION_SETTINGS, DEFAULT_EXPORT_SETTINGS } from '@/lib/constants';

export const useMotionStore = create<AppState>((set, get) => ({
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
  
  // NEW: Usage tracking state
  creditBalance: 0,
  userId: 'demo-user-001', // Default demo user
  isLoadingBalance: false,

  setUserId: (id: string) => set({ userId: id }),

  fetchBalance: async () => {
    const { userId } = get();
    set({ isLoadingBalance: true });
    
    try {
      const response = await fetch(`/api/balance?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        set({ creditBalance: data.balance });
      } else {
        console.error('Failed to fetch balance:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      set({ isLoadingBalance: false });
    }
  },

  recordTransaction: async (params) => {
    const { userId } = get();
    
    try {
      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...params
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to record transaction');
      }

      // Update balance in store
      set({ creditBalance: data.balance });
      
      return data;
    } catch (error) {
      console.error('Failed to record transaction:', error);
      throw error;
    }
  },
  
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
    // Note: We don't reset creditBalance or userId on reset
  })
}));