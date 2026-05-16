import './globals.css'

export const metadata = {
  title: 'QR Code Studio - AI Generated Graphics',
  description: 'Generate stunning graphics with QR codes using AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}