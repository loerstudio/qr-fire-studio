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
    { icon: '📊', text: 'Create QR codes', desc: 'Generate epic QR codes with AI graphics' },
    { icon: '🌐', text: 'Build website', desc: 'QR codes for websites and landing pages' },
    { icon: '💼', text: 'Develop business QR', desc: 'Professional QR codes for business' },
    { icon: '🎨', text: 'Design', desc: 'Custom QR code designs and styles' }
  ]

  const handleQuickAction = (action) => {
    const prompts = {
      'Create QR codes': 'Crea un QR code fitness con atleta muscoloso, fuoco e lightning per https://salutediferro.com',
      'Build website': 'Crea un QR code per il mio sito web https://miositio.com con stile moderno e pulito',
      'Develop business QR': 'Crea un QR code business professionale per https://azienda.com con colori oro e nero',
      'Design': 'Crea un QR code personalizzato con design creativo per https://portfolio.com'
    }
    setInput(prompts[action.text] || action.text)
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar - ESATTO COME MANUS */}
      <div className="w-64 bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-lg">
              🔥
            </div>
            <span className="font-semibold text-lg text-white">QR Fire Studio</span>
            <span className="text-xs bg-blue-600 px-2 py-1 rounded text-white">1.6 Lite</span>
          </div>
        </div>

        {/* Navigation Icons - ESATTO MANUS */}
        <nav className="flex-1 py-6">
          <div className="space-y-1 px-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">📝</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">📱</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">🕐</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">🔍</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">📚</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">⚙️</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">🎙️</span>
            </div>
          </div>
        </nav>

        {/* Bottom Icons */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">📞</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">👥</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
              <span className="text-xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - ESATTO MANUS */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
          <div></div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Free plan</span>
            <button className="text-blue-400 text-sm hover:text-blue-300">Upgrade</button>
            <div className="flex items-center space-x-2">
              <span className="text-sm">⚡ 300</span>
              <button className="p-2 hover:bg-[#2a2a2a] rounded">
                <span className="text-lg">🔔</span>
              </button>
              <button className="p-2 hover:bg-[#2a2a2a] rounded">
                <span className="text-lg">⋯</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Main Title - ESATTO MANUS */}
          <h1 className="text-4xl font-light text-center mb-16 text-gray-200">
            What can I do for you?
          </h1>

          {/* Input Field - ESATTO MANUS */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-12">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Assign a task or ask anything"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl px-6 py-4 text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-24"
                disabled={isGenerating}
              />

              {/* Icons inside input - ESATTO MANUS */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-[#2a2a2a] rounded transition-colors"
                  title="Upload file"
                >
                  <span className="text-gray-400 text-lg">📎</span>
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-1 rounded transition-colors ${isListening ? 'bg-red-600 text-white' : 'hover:bg-[#2a2a2a] text-gray-400'}`}
                  title="Voice input"
                >
                  <span className="text-lg">🎙️</span>
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="p-1 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50"
                  title="Send"
                >
                  <span className="text-gray-400 text-lg">↗</span>
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

            {/* Blue dot indicator */}
            <div className="flex justify-end mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </form>

          {/* Quick Actions - ESATTO MANUS */}
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="flex items-center space-x-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-6 py-4 transition-colors group"
                disabled={isGenerating}
              >
                <span className="text-2xl">{action.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-200">{action.text}</div>
                  <div className="text-xs text-gray-500">{action.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="mt-8">
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>Creating your epic QR code...</span>
              </div>
            </div>
          )}

          {/* Voice Status */}
          {isListening && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Listening... Speak your request</span>
              </div>
            </div>
          )}
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="border-t border-[#2a2a2a] p-6">
            <h3 className="text-lg font-medium mb-4 text-gray-200">Recent Creations</h3>
            <div className="grid grid-cols-4 gap-4">
              {generatedImages.slice(0, 8).map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.imageUrl}
                    alt="Generated QR"
                    className="w-full aspect-square object-cover rounded-lg border border-[#3a3a3a]"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
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