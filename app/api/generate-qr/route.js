import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request) {
  try {
    const { url, style, customPrompt } = await request.json()

    // Validate URL
    let qrUrl = url
    if (!qrUrl.startsWith('http')) {
      if (qrUrl.startsWith('@')) {
        qrUrl = `https://instagram.com/${qrUrl.substring(1)}`
      } else {
        qrUrl = `https://${qrUrl}`
      }
    }

    // Generate QR Code as data URL (for frontend)
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    // Enhanced prompt for Fal.ai (with clear QR area)
    let enhancedPrompt = `
      ${style.prompt}
      ${customPrompt || ''}
      dramatic muscular athlete, fire effects, lightning, epic pose,
      dark dramatic background, orange and red flames,
      leave center-right area COMPLETELY CLEAR for QR code placement,
      professional layout, 8K resolution, cinematic quality
    `.trim()

    // Use Fal.ai to generate AI background
    let aiImageUrl = null

    if (process.env.FAL_API_KEY && process.env.FAL_API_KEY !== 'demo') {
      try {
        const response = await fetch('https://fal.run/openai/gpt-image-2', {
          method: 'POST',
          headers: {
            'Authorization': `Key ${process.env.FAL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            quality: 'high',
            image_size: {
              width: 1024,
              height: 1024
            }
          })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.images && result.images.length > 0) {
            aiImageUrl = result.images[0].url
          }
        }
      } catch (error) {
        console.error('Fal.ai generation failed:', error)
      }
    }

    return NextResponse.json({
      aiImageUrl: aiImageUrl, // AI background image
      qrCodeDataUrl: qrCodeDataUrl, // QR code as data URL
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


