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

    // Generate QR Code as buffer
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      width: 256,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    // Enhance prompt - NO text generation by AI
    let enhancedPrompt = `
      ${style.prompt}
      ${customPrompt ? `, ${customPrompt}` : ''}
      NO TEXT, no words, no letters, no typography in the image,
      NO QR CODE in the image, no barcode, no square patterns,
      dramatic bodybuilder pose only, epic background,
      ultra detailed, 8K resolution, masterpiece quality
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

        // Add text overlay with Sharp
        const textOverlay = Buffer.from(`
          <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
            <!-- Dark overlay for text readability -->
            <rect width="1024" height="300" fill="black" opacity="0.4"/>
            <rect y="650" width="1024" height="374" fill="black" opacity="0.5"/>

            <!-- Top text -->
            <text x="512" y="120" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="white" text-anchor="middle" stroke="black" stroke-width="3">
              IL MEDICO TI
            </text>
            <text x="512" y="200" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="#ff6b35" text-anchor="middle" stroke="black" stroke-width="3">
              PRENDE PER PAZZO?
            </text>

            <!-- Bottom text part 1 -->
            <text x="420" y="780" font-family="Arial Black, sans-serif" font-size="64" font-weight="900" fill="white" text-anchor="end" stroke="black" stroke-width="2">
              SDF È LA
            </text>

            <!-- Bottom text part 2 -->
            <text x="610" y="780" font-family="Arial Black, sans-serif" font-size="64" font-weight="900" fill="#ff6b35" text-anchor="start" stroke="black" stroke-width="2">
              SOLUZIONE
            </text>

            <!-- SCAN QUI text -->
            <text x="512" y="880" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ff6b35" text-anchor="middle">
              SCAN QUI
            </text>
          </svg>
        `)

        // Resize QR to fit in the middle of text
        const qrResized = await sharp(qrBuffer)
          .resize(140, 140)
          .toBuffer()

        // Create white background for QR
        const qrWithBg = await sharp({
          create: {
            width: 160,
            height: 160,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
          .composite([
            { input: qrResized, top: 10, left: 10 }
          ])
          .toBuffer()

        // Composite everything: AI background + text overlay + QR code
        const finalImage = await sharp(aiImageBuffer)
          .composite([
            {
              input: textOverlay,
              top: 0,
              left: 0
            },
            {
              input: qrWithBg,
              top: 700, // Position between "SDF È LA" and "SOLUZIONE"
              left: 432  // Centered between the text
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
      background: { r: 255, g: 107, b: 53, alpha: 1 }
    }
  }).jpeg().toBuffer()

  // Resize QR
  const qrResized = await sharp(qrBuffer)
    .resize(400, 400)
    .toBuffer()

  // Composite QR on background
  const final = await sharp(background)
    .composite([
      {
        input: qrResized,
        gravity: 'center'
      }
    ])
    .jpeg({ quality: 95 })
    .toBuffer()

  return `data:image/jpeg;base64,${final.toString('base64')}`
}