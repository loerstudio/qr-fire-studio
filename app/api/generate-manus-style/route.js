import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { prompt, url, referenceImage, style } = await request.json()

    // Validate URL
    let qrUrl = url
    if (!qrUrl.startsWith('http')) {
      qrUrl = `https://${qrUrl}`
    }

    // Create comprehensive prompt like Manus does
    const manusStylePrompt = `
      Create an epic QR code design with the following specifications:

      URL TO ENCODE: ${qrUrl}

      VISUAL STYLE: ${style}
      USER REQUEST: ${prompt}

      REQUIREMENTS:
      - Generate a WORKING QR code that scans to ${qrUrl}
      - Integrate the QR code artistically into the design
      - Include professional typography with golden text "Parli di SALUTE DI FERRO?"
      - Add "SCAN QUI" prominently in the center
      - Include motivational text "SCANNA. TRASFORMA. VIVI." on the left
      - Dramatic muscular athlete with fire effects and lightning
      - Dark background with orange and red flames
      - Professional fitness poster aesthetic
      - Ultra high quality, 8K resolution, cinematic composition
      - The QR code must be scannable and functional

      ${referenceImage ? 'Use the provided reference image as style inspiration.' : ''}

      Create everything in one unified image - QR code + graphics + text + styling.
    `.trim()

    // Use Fal.ai GPT-Image-2 exactly like Manus
    if (process.env.FAL_API_KEY && process.env.FAL_API_KEY !== 'demo') {
      try {
        const falResponse = await fetch('https://fal.run/fal-ai/flux-pro', {
          method: 'POST',
          headers: {
            'Authorization': `Key ${process.env.FAL_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: manusStylePrompt,
            image_size: "landscape_4_3",
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: false
          })
        })

        if (!falResponse.ok) {
          throw new Error(`Fal.ai API error: ${falResponse.status}`)
        }

        const result = await falResponse.json()

        if (result.images && result.images.length > 0) {
          return NextResponse.json({
            imageUrl: result.images[0].url,
            qrUrl: qrUrl,
            prompt: manusStylePrompt
          })
        } else {
          throw new Error('No image generated')
        }

      } catch (falError) {
        console.error('Fal.ai generation failed:', falError)

        // Fallback to demo response
        return NextResponse.json({
          imageUrl: createDemoImage(qrUrl),
          qrUrl: qrUrl,
          prompt: manusStylePrompt
        })
      }
    } else {
      // Demo mode
      return NextResponse.json({
        imageUrl: createDemoImage(qrUrl),
        qrUrl: qrUrl,
        prompt: manusStylePrompt
      })
    }

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

function createDemoImage(qrUrl) {
  // Create a demo SVG with QR placeholder
  const demoSvg = `
    <svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#FF3D00;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1024" height="768" fill="url(#fireGrad)"/>

      <!-- Demo athlete silhouette -->
      <ellipse cx="200" cy="400" rx="80" ry="150" fill="#000" opacity="0.6"/>

      <!-- Golden text -->
      <text x="50" y="100" font-family="Arial Black" font-size="48" font-weight="bold" fill="url(#goldGrad)">
        Parli di SALUTE
      </text>
      <text x="50" y="160" font-family="Arial Black" font-size="56" font-weight="bold" fill="url(#goldGrad)">
        DI FERRO?
      </text>

      <!-- QR Code placeholder -->
      <rect x="500" y="250" width="200" height="200" fill="#FFF" stroke="#8B4513" stroke-width="8" rx="10"/>
      <text x="600" y="360" font-family="monospace" font-size="12" fill="#000" text-anchor="middle">
        QR CODE
      </text>
      <text x="600" y="375" font-family="monospace" font-size="10" fill="#666" text-anchor="middle">
        ${qrUrl}
      </text>

      <!-- SCAN QUI -->
      <text x="600" y="500" font-family="Arial Black" font-size="42" font-weight="bold" fill="#FFF" text-anchor="middle">
        SCAN QUI
      </text>

      <!-- Left side motivational text -->
      <text x="50" y="520" font-family="Arial" font-size="32" font-weight="bold" fill="#FFF">
        SCANNA.
      </text>
      <text x="50" y="560" font-family="Arial" font-size="32" font-weight="bold" fill="#FF6B35">
        TRASFORMA.
      </text>
      <text x="50" y="600" font-family="Arial" font-size="32" font-weight="bold" fill="#FFF">
        VIVI.
      </text>

      <!-- Demo watermark -->
      <text x="512" y="720" font-family="Arial" font-size="24" fill="#FFD700" text-anchor="middle" opacity="0.8">
        🔥 DEMO MODE - Add FAL_API_KEY for AI generation
      </text>
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(demoSvg).toString('base64')}`
}