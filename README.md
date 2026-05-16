# 🔥 QR Fire Studio - AI QR Code Generator SaaS

Generate epic QR codes with AI-powered graphics. Perfect for fitness, business, fashion, and more!

## Features

- 🎨 6 Premium Styles (Fitness, Business, Fashion, Food, Tech, Nature)
- 🤖 AI-powered image generation with Fal.ai
- 📱 QR code overlay on stunning backgrounds
- 💾 Gallery to save and download creations
- 🚀 Ready for Vercel deployment

## Setup

### 1. Local Development

```bash
npm install
npm run dev
```

### 2. Environment Variables

Create `.env.local`:

```env
FAL_API_KEY=your_fal_api_key_here
```

Get your API key from [fal.ai](https://fal.ai)

**Uses FAL.AI for:**
- 🤖 Claude Sonnet (prompt enhancement)
- 🎨 GPT-Image-2 (image generation)

### 3. Deploy to Vercel

```bash
vercel
```

Then set your environment variable:

```bash
vercel env add FAL_API_KEY
```

## Pricing

- Free Trial: 7 days
- Pro Plan: €9/month (unlimited generations)

## Tech Stack

- Next.js 16
- React 19
- Fal.ai API (Flux Pro model)
- Canvas for QR overlay
- Vercel hosting

## Demo Mode

The app works in demo mode without API key, generating styled QR codes without AI backgrounds.