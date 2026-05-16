import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import * as fal from '@fal-ai/serverless-client'

export async function POST(request) {
  try {
    const { prompt, imageRef, apiKey } = await request.json()

    // Check if demo mode
    const isDemoMode = apiKey === 'demo'

    // Configure Fal.ai client with API key (skip in demo mode)
    if (!isDemoMode) {
      if (!apiKey) {
        throw new Error('API key mancante')
      }

      fal.config({
        credentials: apiKey
      })
    }

    // Extract URL from prompt for QR code
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/) ||
                     prompt.match(/www\.[^\s]+/) ||
                     prompt.match(/[a-zA-Z0-9]+\.(com|it|org|net|io)[^\s]*/)

    let qrUrl = urlMatch ? urlMatch[0] : 'https://example.com'
    if (!qrUrl.startsWith('http')) {
      qrUrl = 'https://' + qrUrl
    }

    // Generate QR code as base64
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Prepare the enhanced prompt for Fal.ai
    const enhancedPrompt = `
      Create a stunning, high-quality graphic design that incorporates a QR code seamlessly.
      ${prompt}
      Style: Modern, professional, eye-catching, with beautiful colors and composition.
      The QR code should be integrated naturally into the design.
      Make it visually appealing for social media or print.
      High resolution, 4K quality, professional design.
    `.trim()

    let generatedImageUrl

    if (isDemoMode) {
      // In demo mode, create a styled QR code without AI
      generatedImageUrl = qrCodeDataUrl
    } else {
      // Call Fal.ai GPTImage2 API to generate image
      const result = await fal.subscribe('fal-ai/fast-sdxl', {
        input: {
          prompt: enhancedPrompt,
          image_size: 'square_hd',
          num_inference_steps: 25,
          guidance_scale: 7.5,
          num_images: 1,
          enable_safety_checker: true,
          format: 'jpeg'
        }
      })

      if (!result.images || result.images.length === 0) {
        throw new Error('No image generated')
      }

      // Get the generated image URL
      generatedImageUrl = result.images[0].url
    }

    // Here we would normally overlay the QR code on the generated image
    // For simplicity, we'll return both separately
    // In production, you'd use sharp or canvas to composite them

    return NextResponse.json({
      imageUrl: generatedImageUrl,
      qrCode: qrCodeDataUrl,
      qrUrl: qrUrl
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}