import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { width, height } = await params
  const w = parseInt(width) || 400
  const h = parseInt(height) || 400

  // Create a simple placeholder image
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff3b00;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#grad)"/>
      <rect x="${w/2 - 100}" y="${h/2 - 100}" width="200" height="200" fill="white" rx="10"/>
      <text x="${w/2}" y="${h/2}" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#333">
        QR FIRE
      </text>
      <text x="${w/2}" y="${h/2 + 30}" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
        AI Generated
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}