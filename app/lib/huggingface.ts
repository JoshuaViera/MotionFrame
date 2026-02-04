// HuggingFace API client for image generation
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

const NEGATIVE_PROMPT = 'ugly, blurry, bad anatomy, bad quality, distorted, watermark, text, signature, low quality, worst quality';

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
    // Generate image using the SDK
    // In Node.js (server-side), this returns base64 string
    // In browser, this returns a Blob
    const result = await client.textToImage({
      model: 'runwayml/stable-diffusion-v1-5',
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt: params.negativePrompt || NEGATIVE_PROMPT,
      }
    });

    // Handle both string (Node.js) and Blob (browser) responses
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
  } catch (error: any) {
    // Handle specific error cases
    if (error.message?.includes('loading')) {
      throw new Error('Model is loading. Please wait 20-30 seconds and try again.');
    }
    
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Invalid API key. Please check your HuggingFace token.');
    }
    
    throw new Error(`HuggingFace API error: ${error.message || error}`);
  }
}