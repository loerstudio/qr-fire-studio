import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { userPrompt, style } = await request.json()

    // Optimize prompt directly for GPT-Image-2 - NO QR in the AI image
    const enhancedPrompt = `${style}, ${userPrompt}, NO QR CODE in the image, no barcode, no square patterns, ultra detailed, photorealistic, 8K resolution, masterpiece quality, professional photography, dramatic lighting, perfect composition, trending on artstation, award winning design, high contrast, vibrant colors, sharp focus, cinematic quality`

    return NextResponse.json({
      enhancedPrompt
    })

  } catch (error) {
    console.error('Prompt enhancement error:', error)

    // Fallback
    return NextResponse.json({
      enhancedPrompt: `${style}, ${userPrompt}`
    })
  }
}