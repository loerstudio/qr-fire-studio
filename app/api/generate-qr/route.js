import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { createCanvas, loadImage } from 'canvas'

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

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 512,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    // Create epic prompt based on style
    const basePrompt = style.prompt
    const enhancedPrompt = `
      ${basePrompt}
      ${customPrompt ? `, ${customPrompt}` : ''}
      ultra detailed, 8K resolution, masterpiece quality, professional photography,
      dramatic composition, trending on artstation, award winning design,
      perfect lighting, sharp focus, high contrast, vibrant colors
    `.trim()

    // Use Fal.ai to generate image
    let generatedImageUrl

    if (process.env.FAL_API_KEY && process.env.FAL_API_KEY !== 'demo') {
      try {
        // Call Fal.ai API using fetch directly
        const response = await fetch('https://fal.run/fal-ai/flux-pro', {
          method: 'POST',
          headers: {
            'Authorization': `Key ${process.env.FAL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            image_size: 'square_hd',
            num_inference_steps: 25,
            guidance_scale: 3.5,
            num_images: 1,
            safety_tolerance: 2
          })
        })

        if (!response.ok) {
          throw new Error('AI generation failed')
        }

        const result = await response.json()

        if (!result.images || result.images.length === 0) {
          throw new Error('No image generated')
        }

        const aiImageUrl = result.images[0].url

        // Overlay QR code on AI image
        generatedImageUrl = await overlayQRCode(aiImageUrl, qrCodeDataUrl)
      } catch (aiError) {
        console.log('AI generation failed, using demo mode:', aiError.message)
        // Fallback to demo mode
        generatedImageUrl = await createStyledQR(qrCodeDataUrl, style.name)
      }
    } else {
      // Demo mode - return styled QR without AI
      generatedImageUrl = await createStyledQR(qrCodeDataUrl, style.name)
    }

    return NextResponse.json({
      imageUrl: generatedImageUrl,
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

async function overlayQRCode(backgroundUrl, qrDataUrl) {
  try {
    const canvas = createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')

    // Load background image
    const background = await loadImage(backgroundUrl)
    ctx.drawImage(background, 0, 0, 1024, 1024)

    // Add dark overlay for QR area
    const qrSize = 280
    const qrX = (1024 - qrSize) / 2
    const qrY = 1024 - qrSize - 80

    // Draw semi-transparent dark background for QR
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20)
    ctx.fill()

    // Draw white background for QR
    ctx.fillStyle = 'white'
    ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 15)
    ctx.fill()

    // Load and draw QR code
    const qrImage = await loadImage(qrDataUrl)
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

    // Add scan text
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('SCAN QR', 1024 / 2, qrY - 35)

    return canvas.toDataURL('image/jpeg', 0.95)
  } catch (error) {
    console.error('Overlay error:', error)
    throw error
  }
}

async function createStyledQR(qrDataUrl, styleName) {
  const canvas = createCanvas(1024, 1024)
  const ctx = canvas.getContext('2d')

  // Create gradient background based on style
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024)
  gradient.addColorStop(0, '#ff6b35')
  gradient.addColorStop(1, '#ff3b00')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1024, 1024)

  // Add pattern overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  for (let i = 0; i < 20; i++) {
    ctx.beginPath()
    ctx.arc(
      Math.random() * 1024,
      Math.random() * 1024,
      Math.random() * 100 + 50,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }

  // Draw QR container
  const qrSize = 400
  const qrX = (1024 - qrSize) / 2
  const qrY = (1024 - qrSize) / 2

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.roundRect(qrX - 30, qrY - 30, qrSize + 60, qrSize + 60, 30)
  ctx.fill()

  ctx.fillStyle = 'white'
  ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20)
  ctx.fill()

  // Load and draw QR code
  const qrImage = await loadImage(qrDataUrl)
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

  // Add style text
  ctx.fillStyle = 'white'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  ctx.shadowBlur = 10
  ctx.fillText(styleName.toUpperCase(), 512, 150)

  ctx.font = 'bold 32px Arial'
  ctx.fillText('SCAN TO DISCOVER', 512, qrY + qrSize + 80)

  return canvas.toDataURL('image/jpeg', 0.95)
}