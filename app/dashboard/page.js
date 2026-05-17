'use client'

import { useState, useRef, useEffect } from 'react'

export default function Dashboard() {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [referenceImage, setReferenceImage] = useState(null)
  const [generatedImages, setGeneratedImages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'it-IT'

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        setInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const quickActions = [
    'Create QR codes',
    'Build website QR',
    'Business QR design',
    'Custom QR style',
    'More'
  ]

  const handleQuickAction = (action) => {
    const prompts = {
      'Create QR codes': 'Crea un QR code epico per https://salutediferro.com con atleta muscoloso e fuoco',
      'Build website QR': 'Crea un QR code moderno per il mio sito https://miositio.com',
      'Business QR design': 'Crea un QR code business professionale per https://azienda.com',
      'Custom QR style': 'Crea un QR code personalizzato con design creativo'
    }
    setInput(prompts[action] || action)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    try {
      const urlMatch = input.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      const url = urlMatch ? urlMatch[0] : 'https://example.com'

      const response = await fetch('/api/generate-manus-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          url: url,
          referenceImage: referenceImage,
          style: "Epic QR code design"
        })
      })

      const data = await response.json()

      if (data.error) {
        alert(`Errore: ${data.error}`)
      } else {
        const newImage = {
          id: Date.now(),
          imageUrl: data.imageUrl,
          qrUrl: data.qrUrl,
          prompt: input,
          createdAt: new Date()
        }
        setGeneratedImages(prev => [newImage, ...prev])
      }
    } catch (error) {
      alert(`Errore: ${error.message}`)
    } finally {
      setIsGenerating(false)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      {/* Sidebar SOTTILE come Manus */}
      <div className="w-16 bg-[#0d0d0d] border-r border-[#2a2a2a] flex flex-col">
        {/* Logo */}
        <div className="p-3 border-b border-[#2a2a2a] flex justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-sm">
            🔥
          </div>
        </div>

        {/* Navigation Icons ESATTO Manus */}
        <nav className="flex-1 py-4">
          <div className="space-y-2 px-2">
            <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center cursor-pointer hover:bg-[#2a2a2a] transition-colors">
              <span className="text-lg">✏️</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">📱</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">🕐</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">🔍</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">📚</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">⚙️</span>
            </div>
          </div>
        </nav>

        {/* Bottom Icons */}
        <div className="p-2 border-t border-[#2a2a2a]">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">📞</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">👥</span>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <span className="text-lg">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content ESATTO Manus */}
      <div className="flex-1 flex flex-col">
        {/* Header IDENTICO */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center space-x-3">
            <div className="text-lg font-medium">QR Fire Studio</div>
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">1.6 Lite</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">Free plan</div>
            <button className="text-blue-400 text-sm hover:text-blue-300">Upgrade</button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⚡</span>
                <span className="text-sm">300</span>
              </div>
              <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                <span className="text-lg">🔔</span>
              </button>
              <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                <span className="text-lg">⋯</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Content IDENTICO */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Main Title */}
          <h1 className="text-5xl font-light text-center mb-16 text-white tracking-wide">
            What can I do for you?
          </h1>

          {/* Input Container ESATTO Manus */}
          <div className="w-full max-w-4xl mb-8">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Assign a task or ask anything"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-6 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors pr-32"
                  disabled={isGenerating}
                />

                {/* Icon da sinistra nell'input */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">🔵</span>
                </div>

                {/* Icons da destra nell'input ESATTO Manus */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 hover:bg-[#2a2a2a] rounded transition-colors"
                  >
                    <span className="text-gray-400">📎</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-1 rounded transition-colors ${isListening ? 'bg-red-600 text-white' : 'hover:bg-[#2a2a2a] text-gray-400'}`}
                  >
                    <span>🎙️</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isGenerating}
                    className="p-1 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50"
                  >
                    <span className="text-gray-400">↗️</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </form>

            {/* Blue dot indicator */}
            <div className="flex justify-end mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* Quick Actions PILLS ORIZZONTALI come Manus */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="flex items-center space-x-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] rounded-full px-4 py-2 text-sm transition-colors"
                disabled={isGenerating}
              >
                <span className="text-sm">
                  {action === 'Create QR codes' && '📊'}
                  {action === 'Build website QR' && '🌐'}
                  {action === 'Business QR design' && '💼'}
                  {action === 'Custom QR style' && '🎨'}
                  {action === 'More' && '⋯'}
                </span>
                <span className="text-gray-300">{action}</span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span>Creating your epic QR code...</span>
            </div>
          )}

          {/* Voice Status */}
          {isListening && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">🎙️ Listening...</span>
              </div>
            </div>
          )}
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="border-t border-[#2a2a2a] p-6">
            <h3 className="text-lg font-medium mb-4">Recent QR Creations</h3>
            <div className="grid grid-cols-6 gap-3">
              {generatedImages.slice(0, 12).map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.imageUrl}
                    alt="Generated QR"
                    className="w-full aspect-square object-cover rounded-lg border border-[#333]"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}