import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { userPrompt, style } = await request.json()

    // Use Claude Sonnet to enhance the prompt
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Create an epic, professional image generation prompt for GPT-Image-2.

Style: ${style}
User request: ${userPrompt}

Requirements:
- Ultra detailed, 8K resolution, masterpiece quality
- Professional photography style
- Dramatic composition and lighting
- High contrast, vibrant colors
- Trending on artstation quality
- Award-winning design

Return ONLY the enhanced prompt, nothing else.`
        }]
      })
    })

    if (!response.ok) {
      throw new Error('Claude API failed')
    }

    const data = await response.json()
    const enhancedPrompt = data.content[0].text.trim()

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