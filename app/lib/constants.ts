import { StylePreset, AnimationType } from '../types';

export const STYLE_PRESETS: { value: StylePreset; label: string; description: string }[] = [
  {
    value: 'cinematic',
    label: 'Cinematic',
    description: 'Dramatic lighting, film-like quality'
  },
  {
    value: 'anime',
    label: 'Anime',
    description: 'Japanese animation style'
  },
  {
    value: 'photorealistic',
    label: 'Photorealistic',
    description: 'Lifelike, detailed imagery'
  },
  {
    value: 'abstract',
    label: 'Abstract',
    description: 'Non-representational, artistic'
  },
  {
    value: 'retro',
    label: 'Retro',
    description: 'Vintage, nostalgic aesthetic'
  }
];

export const ANIMATION_TYPES: { value: AnimationType; label: string; description: string }[] = [
  {
    value: 'zoom',
    label: 'Zoom',
    description: 'Smooth zoom in/out effect'
  },
  {
    value: 'drift',
    label: 'Drift',
    description: 'Gentle floating motion'
  },
  {
    value: 'hallucination',
    label: 'Void Hallucination',
    description: 'Experimental reality warping and chromatic shifts'
  }
];

export const DEFAULT_ANIMATION_SETTINGS = {
  type: 'zoom' as AnimationType,
  duration: 3,
  intensity: 50
};

export const DEFAULT_EXPORT_SETTINGS = {
  format: 'gif' as const,
  fps: 30,
  quality: 80
};