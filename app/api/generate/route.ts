import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/app/lib/huggingface';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style } = body;

    // Validation
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!style || typeof style !== 'string') {
      return NextResponse.json(
        { error: 'Style is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate image
    const result = await generateImage({ prompt, style });

    return NextResponse.json({
      success: true,
      imageUrl: result.url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}