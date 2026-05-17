import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import sharp from 'sharp'

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

    // Generate QR Code as JPEG buffer (Sharp compatible)
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF' // White background, no transparency
      },
      errorCorrectionLevel: 'H',
      type: 'png'
    })

    // Parse custom prompt to extract text
    let topLine1 = "Parli di"
    let topLine2 = "SALUTE"
    let topLine3 = "DI FERRO?"
    let bottomLine1 = "SCANNA."
    let bottomLine2 = "TRASFORMA."
    let bottomLine3 = "VIVI."
    let scanText = "SCAN QUI"
    let websiteUrl = qrUrl.replace('https://', '').replace('http://', '').toLowerCase()

    // Extract custom text if provided
    if (customPrompt && customPrompt.includes("'")) {
      const match = customPrompt.match(/'([^']+)'/)
      if (match) {
        const text = match[1]
        // Parse the text intelligently
        if (text.toLowerCase().includes('medico')) {
          topLine1 = "IL MEDICO TI"
          topLine2 = "PRENDE"
          topLine3 = "PER PAZZO?"
        }
      }
    }

    // Enhanced prompt with text burned into AI image
    let enhancedPrompt = `
      ${style.prompt}
      ${customPrompt ? customPrompt.replace(/'[^']+'/g, '') : ''}
      INCLUDE TEXT: golden text at top saying "${topLine1} ${topLine2} ${topLine3}",
      white text at bottom left "${bottomLine1} ${bottomLine2} ${bottomLine3}",
      large center text "SCAN QUI", website url "${websiteUrl}" at bottom,
      dramatic muscular athlete, fire effects, lightning, epic pose,
      dark dramatic background, orange and red flames,
      professional typography layout with golden gradients,
      leave center-right area clear for QR code placement,
      ultra detailed, 8K resolution, cinematic quality
    `.trim()

    // Use Fal.ai to generate image
    let generatedImageUrl

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

        if (!response.ok) {
          console.error('Fal.ai API error:', response.status, response.statusText)
          throw new Error('AI generation failed')
        }

        const result = await response.json()

        if (!result.images || result.images.length === 0) {
          throw new Error('No image generated')
        }

        const aiImageUrl = result.images[0].url

        // Download AI image
        const aiImageResponse = await fetch(aiImageUrl)
        if (!aiImageResponse.ok) {
          throw new Error('Failed to download AI image')
        }
        const aiImageBuffer = Buffer.from(await aiImageResponse.arrayBuffer())

        // NO OVERLAY - Just AI image + QR code (working solution)
        // Text will be burned into AI image by the prompt itself

        // Create white background for QR
        const qrWithBg = await sharp({
          create: {
            width: 280,
            height: 280,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
          .composite([
            {
              input: await sharp(qrBuffer).resize(260, 260).toBuffer(),
              top: 10,
              left: 10
            }
          ])
          .toBuffer()

        // Add border to QR
        const qrWithBorder = await sharp(qrWithBg)
          .extend({
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
            background: { r: 139, g: 69, b: 19, alpha: 1 } // Brown border
          })
          .toBuffer()

        // Composite ONLY AI background + QR code (no overlay issues)
        const finalImage = await sharp(aiImageBuffer)
          .composite([
            {
              input: qrWithBorder,
              top: 420,
              left: 370
            }
          ])
          .jpeg({ quality: 95 })
          .toBuffer()

        // Convert to base64
        generatedImageUrl = `data:image/jpeg;base64,${finalImage.toString('base64')}`

      } catch (aiError) {
        console.error('AI generation failed:', aiError.message)
        // Fallback to demo mode
        generatedImageUrl = await createDemoQR(qrBuffer, style.name)
      }
    } else {
      // Demo mode
      generatedImageUrl = await createDemoQR(qrBuffer, style.name)
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

async function createDemoQR(qrBuffer, styleName) {
  // Create gradient background
  const background = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 20, g: 20, b: 20, alpha: 1 }
    }
  }).jpeg().toBuffer()

  // Create simple overlay without SVG
  const overlay = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 255, g: 107, b: 53, alpha: 50 } // Orange tint
    }
  }).png().toBuffer()

  // Resize QR
  const qrResized = await sharp(qrBuffer)
    .resize(300, 300)
    .toBuffer()

  // Create white background for QR
  const qrWithBg = await sharp({
    create: {
      width: 320,
      height: 320,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: qrResized, top: 10, left: 10 }
    ])
    .toBuffer()

  // Composite everything
  const final = await sharp(background)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: qrWithBg, top: 352, left: 352 }
    ])
    .jpeg({ quality: 95 })
    .toBuffer()

  return `data:image/jpeg;base64,${final.toString('base64')}`
}