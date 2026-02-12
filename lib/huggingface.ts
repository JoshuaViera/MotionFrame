// HuggingFace API client for image generation - FREE MODEL VERSION
import { InferenceClient } from '@huggingface/inference';

export interface HuggingFaceImageResponse {
  blob: Blob;
  url: string;
}

export interface GenerateImageParams {
  prompt: string;
  style: string;
  negativePrompt?: string;
}

// Style-specific prompt enhancements
const STYLE_MODIFIERS: Record<string, string> = {
  cinematic: 'cinematic lighting, dramatic atmosphere, film grain, depth of field, professional photography',
  anime: 'anime style, manga art, vibrant colors, cel shaded, japanese animation',
  photorealistic: 'photorealistic, ultra detailed, 8k resolution, sharp focus, professional photograph',
  abstract: 'abstract art, non-representational, creative, artistic interpretation, unique composition',
  retro: 'retro aesthetic, vintage style, nostalgic, classic design, old-school'
};

export async function generateImage(params: GenerateImageParams): Promise<HuggingFaceImageResponse> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  // Initialize HuggingFace Inference client
  const client = new InferenceClient(apiKey);

  // Enhance prompt with style modifiers
  const styleModifier = STYLE_MODIFIERS[params.style] || '';
  const enhancedPrompt = `${params.prompt}, ${styleModifier}`;

  try {
    // Using Stable Diffusion XL - FREE model (no credits required!)
    const result = await client.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt: params.negativePrompt || 'blurry, low quality, distorted, deformed',
      }
    });

    // Handle both string (Node.js/server) and Blob (browser) responses
    let base64: string;
    let imageBlob: Blob;

    if (typeof result === 'string') {
      // Server-side: result is already base64
      base64 = result;
      // Convert base64 string to Blob for consistency
      const buffer = Buffer.from(base64, 'base64');
      imageBlob = new Blob([buffer], { type: 'image/png' });
    } else {
      // Browser-side: result is a Blob
      imageBlob = result;
      const buffer = Buffer.from(await imageBlob.arrayBuffer());
      base64 = buffer.toString('base64');
    }

    const url = `data:image/png;base64,${base64}`;

    return { blob: imageBlob, url };

  } catch (error: unknown) {
    const err = error as Error & { message?: string };
    console.error('HuggingFace API error:', err);
    
    // Handle specific error cases
    if (err.message?.includes('loading') || err.message?.includes('Loading')) {
      throw new Error('Model is loading. Please wait 20-30 seconds and try again.');
    }
    
    if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
      throw new Error('Invalid API key. Please check your HuggingFace token.');
    }

    if (err.message?.includes('429') || err.message?.includes('rate')) {
      throw new Error('Rate limited. Please wait a moment and try again.');
    }

    if (err.message?.includes('Credit balance')) {
      throw new Error('Model requires credits. Switching to free model failed - please try again.');
    }
    
    throw new Error(`HuggingFace API error: ${err.message || err}`);
  }
}