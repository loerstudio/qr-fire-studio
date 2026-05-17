'use client'

import { useState, useEffect, useRef } from 'react'

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🔥 **QR Fire Studio**\n\nCrea QR codes epici con AI! Invia:\n• URL del tuo sito\n• Immagine reference per lo stile\n• Descrizione del design",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [referenceImage, setReferenceImage] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImage(e.target.result)
        addMessage('user', `📸 Reference image uploaded: ${file.name}`)
      }
      reader.readAsDataURL(file)
    }
  }

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, {
      role,
      content,
      timestamp: new Date(),
      image: role === 'assistant' ? null : undefined
    }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    addMessage('user', userMessage)
    setInput('')
    setIsGenerating(true)

    try {
      // Parse URL from message
      const urlMatch = userMessage.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      const url = urlMatch ? urlMatch[0] : 'https://example.com'

      // Call GPT-Image-2 API exactly like Manus
      const response = await fetch('/api/generate-manus-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          url: url,
          referenceImage: referenceImage,
          style: "Fitness fire epic QR code design"
        })
      })

      const data = await response.json()

      if (data.error) {
        addMessage('assistant', `❌ Errore: ${data.error}`)
      } else {
        // Add image result like Manus
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🔥 **QR Code generato!**\n\nEcco il tuo QR code epico con grafica AI integrata. Pronto per il download!',
          timestamp: new Date(),
          image: data.imageUrl
        }])
      }
    } catch (error) {
      addMessage('assistant', `❌ Errore: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 text-white">
      {/* Header */}
      <div className="border-b border-orange-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                🔥
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  QR Fire Studio
                </h1>
                <p className="text-xs text-gray-400">AI QR Code Generator</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-all">
              Pro Version
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600'
                  : 'bg-gray-800 border border-orange-500/20'
              } rounded-2xl px-4 py-3`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xs">
                      🔥
                    </div>
                    <span className="text-sm font-medium text-orange-400">QR Fire Studio</span>
                  </div>
                )}

                <div className="prose prose-invert prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <div key={i} className="font-bold text-orange-400 mb-2">{line.slice(2, -2)}</div>
                    }
                    if (line.startsWith('•')) {
                      return <div key={i} className="text-gray-300 ml-2">{line}</div>
                    }
                    return <div key={i} className="text-gray-100">{line}</div>
                  })}
                </div>

                {message.image && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-orange-500/30">
                    <img
                      src={message.image}
                      alt="Generated QR Code"
                      className="w-full max-w-md rounded-lg"
                    />
                    <div className="p-3 bg-gray-900/50">
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = message.image
                          link.download = `qr-fire-${Date.now()}.jpg`
                          link.click()
                        }}
                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-all w-full"
                      >
                        📥 Download QR Code
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-orange-500/20 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xs">
                    🔥
                  </div>
                  <span className="text-sm font-medium text-orange-400">Generazione in corso...</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-orange-500/20 bg-black/30 backdrop-blur-sm">
          {referenceImage && (
            <div className="mb-3 p-2 bg-gray-800 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2">
                <img src={referenceImage} alt="Reference" className="w-12 h-12 object-cover rounded" />
                <span className="text-sm text-gray-300">Reference image loaded</span>
                <button
                  onClick={() => setReferenceImage(null)}
                  className="text-red-400 hover:text-red-300 ml-auto"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors"
            >
              📎
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inserisci URL e descrivi il design che vuoi..."
                className="w-full bg-gray-800 text-white border border-orange-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 placeholder-gray-400"
                disabled={isGenerating}
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '⚡' : '🚀'}
            </button>
          </form>

          <div className="text-xs text-gray-500 mt-2 text-center">
            Carica un'immagine reference e descrivi il QR code che vuoi creare
          </div>
        </div>
      </div>
    </div>
  )
}