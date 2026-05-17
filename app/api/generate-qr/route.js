import { NextResponse } from 'next/server'
import Replicate from 'replicate'

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

    // Parse custom prompt to extract text
    let topLine1 = "Parli di"
    let topLine2 = "SALUTE"
    let topLine3 = "DI FERRO?"

    // Extract custom text if provided
    if (customPrompt && customPrompt.includes("'")) {
      const match = customPrompt.match(/'([^']+)'/)
      if (match) {
        const text = match[1]
        if (text.toLowerCase().includes('medico')) {
          topLine1 = "IL MEDICO TI"
          topLine2 = "PRENDE"
          topLine3 = "PER PAZZO?"
        }
      }
    }

    // Enhanced prompt for Replicate QR model
    let enhancedPrompt = `${style.prompt} ${customPrompt || ''} Golden text: "${topLine1} ${topLine2} ${topLine3}" SCAN QUI, dramatic muscular athlete, fire effects, lightning, epic pose, dark background, orange flames, professional typography, 8K quality`

    // Use Replicate QR Code model
    let generatedImageUrl

    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        })

        // Use QR code generation model
        const output = await replicate.run(
          "zylim0702/qr_code_controlnet:8451a4e4b51e5e42bbf4a3b0a2b75e88c4e5e6fdc2e1a5d8b8f8f8f8f8f8f8f8",
          {
            input: {
              prompt: enhancedPrompt,
              qr_code_content: qrUrl,
              guidance_scale: 7.5,
              strength: 0.8,
              width: 1024,
              height: 1024
            }
          }
        )

        generatedImageUrl = output[0] // Replicate returns image URL

      } catch (replicateError) {
        console.error('Replicate generation failed:', replicateError.message)
        // Fallback to demo mode
        generatedImageUrl = createDemoImage()
      }
    } else {
      // Demo mode
      generatedImageUrl = createDemoImage()
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

function createDemoImage() {
  // Return a demo base64 image with QR placeholder
  return "data:image/svg+xml;base64," + btoa(`
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#grad)"/>
      <text x="512" y="200" text-anchor="middle" font-size="72" font-weight="bold" fill="#000">QR FIRE</text>
      <text x="512" y="280" text-anchor="middle" font-size="48" fill="#000">DEMO MODE</text>
      <rect x="400" y="400" width="200" height="200" fill="#000" stroke="#fff" stroke-width="10"/>
      <text x="512" y="700" text-anchor="middle" font-size="32" fill="#000">Add REPLICATE_API_TOKEN</text>
    </svg>
  `)
}

