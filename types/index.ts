export type StylePreset = 'cinematic' | 'anime' | 'photorealistic' | 'abstract' | 'retro';
export type AnimationType = 'zoom' | 'drift';
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

// NEW: Usage tracking types
export interface User {
  id: string;
  email: string;
  credit_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  action_type: 'export' | 'generation' | 'upscale' | 'animation';
  action_details: string;
  cost: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  project_id?: string;
  metadata?: {
    resolution?: string;
    duration?: number;
    fps?: number;
    prompt?: string;
    style?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionParams {
  userId: string;
  actionType: 'export' | 'generation' | 'upscale' | 'animation';
  actionDetails: string;
  cost: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  projectId?: string;
  metadata?: Record<string, any>;
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
  
  // NEW: Usage tracking
  creditBalance: number;
  userId: string;
  isLoadingBalance: boolean;
  setUserId: (id: string) => void;
  fetchBalance: () => Promise<void>;
  recordTransaction: (params: RecordTransactionParams) => Promise<void>;
  
  // Reset
  reset: () => void;
}

export interface RecordTransactionParams {
  actionType: 'export' | 'generation' | 'upscale' | 'animation';
  actionDetails: string;
  cost: number;
  metadata?: Record<string, any>;
}