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

    // Enhance prompt - avoid text generation issues
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
        NO QR CODE in the image, no barcode, no square patterns,
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

        // Parse custom prompt to extract template text
        let topText = "IL MEDICO TI"
        let topText2 = "PRENDE PER PAZZO?"
        let bottomText1 = "SDF È LA"
        let bottomText2 = "SOLUZIONE"

        // Extract text from customPrompt if provided
        if (customPrompt && customPrompt.includes("'")) {
          const match = customPrompt.match(/'([^']+)'/)
          if (match) {
            const fullText = match[1].toUpperCase()
            // Split intelligently
            const lines = fullText.split(/\?|!/).map(l => l.trim()).filter(l => l)
            if (lines[0]) {
              const firstPart = lines[0].split(' ')
              const mid = Math.ceil(firstPart.length / 2)
              topText = firstPart.slice(0, mid).join(' ')
              topText2 = firstPart.slice(mid).join(' ') + '?'
            }
            if (lines[1] && lines[1].includes('È')) {
              const parts = lines[1].split('È')
              bottomText1 = parts[0].trim() + ' È'
              bottomText2 = parts[1]?.trim() || 'LA SOLUZIONE'
            }
          }
        }

        // Overlay QR code with template layout
        generatedImageUrl = await overlayQRTemplate(aiImageUrl, qrCodeDataUrl, {
          topText,
          topText2,
          bottomText1,
          bottomText2
        })
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

async function overlayQRTemplate(backgroundUrl, qrDataUrl, texts) {
  try {
    const canvas = createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')

    // Load background image
    const background = await loadImage(backgroundUrl)
    ctx.drawImage(background, 0, 0, 1024, 1024)

    // Add gradient overlay for text readability
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 1024)

    // TOP TEXT - Big and dramatic
    ctx.fillStyle = 'white'
    ctx.font = 'bold 72px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3

    // First line
    ctx.fillText(texts.topText, 512, 150)

    // Second line (orange)
    ctx.fillStyle = '#ff6b35'
    ctx.fillText(texts.topText2, 512, 230)

    // BOTTOM TEXT WITH QR - "SDF È LA SOLUZIONE" layout
    const qrSize = 140
    const bottomY = 750

    // "SDF È LA" text
    ctx.fillStyle = 'white'
    ctx.font = 'bold 64px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(texts.bottomText1, 420, bottomY)

    // QR Code background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.beginPath()
    ctx.roundRect(442, bottomY - 70 - 10, qrSize + 20, qrSize + 20, 10)
    ctx.fill()

    // White background for QR
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.roundRect(447, bottomY - 70 - 5, qrSize + 10, qrSize + 10, 5)
    ctx.fill()

    // Draw QR code
    const qrImage = await loadImage(qrDataUrl)
    ctx.drawImage(qrImage, 452, bottomY - 70, qrSize, qrSize)

    // "SCAN QUI" under QR
    ctx.fillStyle = '#ff6b35'
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.shadowBlur = 5
    ctx.fillText('SCAN QUI', 452 + qrSize/2, bottomY + 85)

    // "SOLUZIONE" text (orange, after QR)
    ctx.fillStyle = '#ff6b35'
    ctx.font = 'bold 64px Arial'
    ctx.textAlign = 'left'
    ctx.shadowBlur = 10
    ctx.fillText(texts.bottomText2, 610, bottomY)

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