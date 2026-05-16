import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { userPrompt, style } = await request.json()

    // Use Claude Sonnet via Fal.ai
    const response = await fetch('https://fal.run/fal-ai/claude-3-5-sonnet', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Create an epic, professional image generation prompt for GPT-Image-2.

Style: ${style}
User request: ${userPrompt}

Requirements:
- Ultra detailed, 8K resolution, masterpiece quality
- Professional photography style
- Dramatic composition and lighting
- High contrast, vibrant colors
- Trending on artstation quality
- Award-winning design

Return ONLY the enhanced prompt, nothing else.`,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error('Claude via Fal.ai failed')
    }

    const data = await response.json()
    const enhancedPrompt = data.content.trim()

    return NextResponse.json({
      enhancedPrompt
    })

  } catch (error) {
    console.error('Prompt enhancement error:', error)

    // Fallback to basic enhancement if Claude fails
    const fallbackPrompt = `${style}, ${userPrompt}, ultra detailed, 8K resolution, masterpiece quality, professional photography, dramatic composition, trending on artstation, award winning design, perfect lighting, sharp focus, high contrast, vibrant colors`

    return NextResponse.json({
      enhancedPrompt: fallbackPrompt
    })
  }
}