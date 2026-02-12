export interface ExportCostParams {
  duration: number; // in seconds
  resolution: '720p' | '1080p' | '4K';
  fps: number;
  effectType?: 'kenburns' | 'drift' | 'none';
}

export interface GenerationCostParams {
  model: 'flux-dev' | 'stable-diffusion';
  steps?: number;
}

// Base costs in cents
const PRICING = {
  export: {
    base: 10, // $0.10 base cost
    perSecond: 2, // $0.02 per second
    resolution: {
      '720p': 1.0,
      '1080p': 1.2,
      '4K': 1.5
    },
    fps: {
      30: 1.0,
      60: 1.3
    }
  },
  generation: {
    'flux-dev': 15, // $0.15 per image
    'stable-diffusion': 10 // $0.10 per image
  },
  upscale: 10 // $0.10 per upscale
};

export function calculateExportCost(params: ExportCostParams): number {
  const { duration, resolution, fps } = params;
  
  // Base + duration cost
  let cost = PRICING.export.base + (duration * PRICING.export.perSecond);
  
  // Resolution multiplier
  const resMultiplier = PRICING.export.resolution[resolution] || 1.0;
  cost *= resMultiplier;
  
  // FPS multiplier
  const fpsMultiplier = PRICING.export.fps[fps as 30 | 60] || 1.0;
  cost *= fpsMultiplier;
  
  return Math.round(cost);
}

export function calculateGenerationCost(params: GenerationCostParams): number {
  return PRICING.generation[params.model] || 15;
}

export function calculateUpscaleCost(): number {
  return PRICING.upscale;
}

export function formatCost(costInCents: number): string {
  return `$${Math.abs(costInCents / 100).toFixed(2)}`;
}

export function hasEnoughBalance(balance: number, cost: number): boolean {
  return balance >= Math.abs(cost);
}