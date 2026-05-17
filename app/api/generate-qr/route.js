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
      width: 512,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    // Enhance prompt
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
      enhancedPrompt = `
        ${style.prompt}
        ${customPrompt ? `, ${customPrompt}` : ''}
        NO QR CODE in the image, no barcode, no square patterns,
        ultra detailed, 8K resolution, masterpiece quality
      `.trim()
    }

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
          throw new Error('AI generation failed')
        }

        const result = await response.json()

        if (!result.images || result.images.length === 0) {
          throw new Error('No image generated')
        }

        const aiImageUrl = result.images[0].url

        // Download AI image
        const aiImageResponse = await fetch(aiImageUrl)
        const aiImageBuffer = Buffer.from(await aiImageResponse.arrayBuffer())

        // Resize QR to 150x150
        const qrResized = await sharp(qrBuffer)
          .resize(150, 150)
          .toBuffer()

        // Create white background for QR
        const qrWithBg = await sharp({
          create: {
            width: 170,
            height: 190,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
          .composite([
            { input: qrResized, top: 10, left: 10 }
          ])
          .toBuffer()

        // Composite QR on AI image
        const finalImage = await sharp(aiImageBuffer)
          .composite([
            {
              input: qrWithBg,
              gravity: 'south',
              top: 800
            }
          ])
          .jpeg({ quality: 95 })
          .toBuffer()

        // Convert to base64
        generatedImageUrl = `data:image/jpeg;base64,${finalImage.toString('base64')}`

      } catch (aiError) {
        console.log('AI generation failed:', aiError.message)
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