# MotionFrame

AI-powered image generation and animation tool with real-time usage transparency.

## Overview

MotionFrame lets users generate images from text prompts, apply animation effects (zoom/drift), and export as animated GIFs. Built with a Twilio-style usage dashboard that shows exactly what each action costs — eliminating "bill shock."

## Features

- **AI Image Generation** — Generate images from text prompts using Stable Diffusion XL
- **5 Style Presets** — Cinematic, Anime, Photorealistic, Abstract, Retro
- **Animation Effects** — Ken Burns (zoom) and Drift (pan) with adjustable duration/intensity
- **GIF Export** — Export animations as high-quality GIFs
- **Real-Time Billing** — See costs before you commit, watch balance update live
- **Usage Dashboard** — Full transaction history with activity feed

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **State:** Zustand
- **Database:** Supabase (PostgreSQL)
- **AI:** HuggingFace Inference API (Stable Diffusion XL)
- **Animation:** gif.js, Canvas API

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- HuggingFace API key

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/motion-frame.git
cd motion-frame

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT,
  credit_balance INTEGER DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.users(id),
  action_type TEXT NOT NULL,
  action_details TEXT NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  project_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo user
INSERT INTO public.users (id, email, credit_balance)
VALUES ('demo-user-001', 'demo@motionframe.app', 5000)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all for transactions" ON public.transactions FOR ALL USING (true);
```

### Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage Flow

1. **Prompt** — Enter a text description of your image
2. **Style** — Choose from 5 visual style presets
3. **Generate** — AI creates your image (~10 seconds)
4. **Animate** — Preview zoom/drift effects in real-time
5. **Export** — Generate GIF and see the cost deducted
6. **Dashboard** — View all transactions and remaining balance

## Project Structure

```
motion-frame/
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── dashboard/        # Usage dashboard page
│   └── page.tsx          # Main app page
├── lib/
│   ├── animation.ts      # Animation frame calculations
│   ├── frameRenderer.ts  # Canvas rendering
│   ├── ffmpegExporter.ts # GIF encoding
│   ├── huggingface.ts    # AI image generation
│   ├── pricing/          # Cost calculations
│   └── supabase/         # Database helpers
├── store/                # Zustand state management
└── types/                # TypeScript definitions
```

## The Problem We Solve

Creative professionals using AI tools face "bill shock" — unexpected charges from opaque pricing. MotionFrame shows the exact cost of every action **before** you commit, with a real-time activity feed so you always know where your credits went.

## License

MIT

---

Built by Joshua Viera
Features by Duvall Morgan & Elliot Chen 