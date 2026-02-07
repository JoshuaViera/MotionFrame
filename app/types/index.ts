export type StylePreset = 'cinematic' | 'anime' | 'photorealistic' | 'abstract' | 'retro';

export type AnimationType = 'zoom' | 'drift' | 'hallucination';

export type WorkflowStep = 'prompt' | 'style' | 'generation' | 'animation' | 'export';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: StylePreset;
  timestamp: Date;
}

export interface AnimationSettings {
  type: AnimationType;
  duration: number; // in seconds
  intensity: number; // 0-100
}

export interface ExportSettings {
  format: 'gif';
  fps: number;
  quality: number; // 0-100
}

export interface AppState {
  // Workflow
  currentStep: WorkflowStep;
  setCurrentStep: (step: WorkflowStep) => void;

  // Prompt & Style
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedStyle: StylePreset;
  setSelectedStyle: (style: StylePreset) => void;

  // Generated Images
  generatedImage: GeneratedImage | null;
  setGeneratedImage: (image: GeneratedImage | null) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  // Animation
  animationSettings: AnimationSettings;
  setAnimationSettings: (settings: AnimationSettings) => void;
  animatedPreview: string | null;
  setAnimatedPreview: (preview: string | null) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;

  // Export
  exportSettings: ExportSettings;
  setExportSettings: (settings: ExportSettings) => void;
  exportedGif: string | null;
  setExportedGif: (gif: string | null) => void;
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;

  // UI State
  isCinematicMode: boolean;
  setIsCinematicMode: (isCinematic: boolean) => void;

  // Reset
  reset: () => void;
}