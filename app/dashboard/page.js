'use client'

import { useState, useRef, useEffect } from 'react'

export default function Dashboard() {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [referenceImage, setReferenceImage] = useState(null)
  const [generatedImages, setGeneratedImages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    { icon: '🔥', text: 'QR Code Fitness', prompt: 'Crea un QR code fitness con atleta muscoloso, fuoco e lightning per https://salutediferro.com' },
    { icon: '💼', text: 'QR Code Business', prompt: 'Crea un QR code business elegante e professionale per https://miolavoro.com' },
    { icon: '📱', text: 'QR Code Social', prompt: 'Crea un QR code colorato per il mio Instagram @username' },
    { icon: '🎨', text: 'QR Code Custom', prompt: 'Crea un QR code personalizzato per https://miositio.com con stile' }
  ]

  const handleQuickAction = (prompt) => {
    setInput(prompt)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    try {
      // Parse URL from message
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
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:translate-x-0 lg:static lg:w-16 xl:w-64`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                🔥
              </div>
              <span className="font-bold text-lg hidden xl:block">QR Fire Studio</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-600/20 text-orange-400">
                <span className="text-xl">🎨</span>
                <span className="hidden xl:block">Create</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                <span className="text-xl">📱</span>
                <span className="hidden xl:block">Gallery</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                <span className="text-xl">⚡</span>
                <span className="hidden xl:block">Templates</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                <span className="text-xl">🎙️</span>
                <span className="hidden xl:block">Voice Mode</span>
              </div>
            </div>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                👤
              </div>
              <div className="hidden xl:block">
                <div className="text-sm font-medium">Demo User</div>
                <div className="text-xs text-gray-400">Free Plan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2 rounded-lg"
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-2">What can I create for you?</h1>
            <p className="text-gray-400 text-center">Generate epic QR codes with AI-powered graphics</p>
          </div>
        </div>

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="border-b border-gray-800 bg-gray-900/30">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <h3 className="text-lg font-semibold mb-3">Recent Creations</h3>
              <div className="flex space-x-4 overflow-x-auto">
                {generatedImages.slice(0, 5).map((image) => (
                  <div key={image.id} className="flex-shrink-0">
                    <img
                      src={image.imageUrl}
                      alt="Generated QR"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-4xl">

            {/* Reference Image Preview */}
            {referenceImage && (
              <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3">
                  <img src={referenceImage} alt="Reference" className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <p className="text-sm text-gray-300">Reference image loaded</p>
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Input */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the QR code you want to create... Include your URL and design style"
                  className="w-full bg-gray-800 text-white border-2 border-gray-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-orange-500 transition-colors pr-32"
                  disabled={isGenerating}
                />

                {/* Voice and Upload buttons */}
                <div className="absolute right-2 top-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    📎
                  </button>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    🎙️
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isGenerating}
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? '⚡' : '🚀'}
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </form>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors text-left"
                  disabled={isGenerating}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-sm font-medium">{action.text}</div>
                </button>
              ))}
            </div>

            {/* Loading State */}
            {isGenerating && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-3 bg-gray-800 px-6 py-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-300">Creating your epic QR code...</span>
                </div>
              </div>
            )}

            {/* Voice Status */}
            {isListening && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak your QR code request</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}