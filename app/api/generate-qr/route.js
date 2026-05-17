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

    // Enhance prompt with Claude Sonnet
    let enhancedPrompt
    try {
      const promptResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/enhance-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: customPrompt || 'Create an epic graphic',
          style: style.prompt
        })
      })

      if (promptResponse.ok) {
        const promptData = await promptResponse.json()
        enhancedPrompt = promptData.enhancedPrompt
      } else {
        throw new Error('Prompt enhancement failed')
      }
    } catch (error) {
      // Fallback to basic enhancement
      enhancedPrompt = `
        ${style.prompt}
        ${customPrompt ? `, ${customPrompt}` : ''}
        ultra detailed, 8K resolution, masterpiece quality, professional photography,
        dramatic composition, trending on artstation, award winning design,
        perfect lighting, sharp focus, high contrast, vibrant colors
      `.trim()
    }

    // Use Fal.ai to generate image
    let generatedImageUrl

    if (process.env.FAL_API_KEY && process.env.FAL_API_KEY !== 'demo') {
      try {
        // Call Fal.ai GPT-Image-2 text-to-image API
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

    // QR positioning - bottom right corner style epico
    const qrSize = 320
    const qrX = 1024 - qrSize - 60
    const qrY = 1024 - qrSize - 60

    // Create epic background for QR with fire effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.beginPath()
    ctx.roundRect(qrX - 25, qrY - 25, qrSize + 50, qrSize + 50, 25)
    ctx.fill()

    // Orange glow effect
    ctx.shadowColor = '#ff6b35'
    ctx.shadowBlur = 30
    ctx.fillStyle = 'rgba(255, 107, 53, 0.3)'
    ctx.beginPath()
    ctx.roundRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 20)
    ctx.fill()
    ctx.shadowBlur = 0

    // White background for QR
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.roundRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 10)
    ctx.fill()

    // Load and draw QR code
    const qrImage = await loadImage(qrDataUrl)
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

    // Add epic scan text
    ctx.fillStyle = 'white'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 10
    ctx.fillText('SCAN QUI', qrX + qrSize/2, qrY - 40)

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