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

  // Mock mode if API key is missing
  if (!apiKey || apiKey === 'YOUR_HUGGINGFACE_API_KEY') {
    console.warn('HUGGINGFACE_API_KEY is not configured. Using Mock Mode.');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return a beautiful placeholder from Unsplash based on style
    const mockUrls: Record<string, string> = {
      cinematic: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200',
      anime: 'https://images.unsplash.com/photo-1578632738980-43314a5b4236?auto=format&fit=crop&q=80&w=1200',
      photorealistic: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200',
      abstract: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200',
      retro: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200'
    };

    const url = mockUrls[params.style] || mockUrls.cinematic;

    // Create a dummy blob for consistency
    const response = await fetch(url);
    const blob = await response.blob();

    return { blob, url };
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