'use client'

import { useState, useEffect } from 'react'

const STYLES = {
  fitness: {
    name: "Fitness Fire 🔥",
    prompt: "Ultra muscular fitness athlete with intense fire effects, lightning, dramatic lighting, epic pose, motivational energy, high contrast, cinematic composition"
  },
  business: {
    name: "Business Elite 💼",
    prompt: "Professional luxury business setting, gold accents, premium quality, elegant design, sophisticated atmosphere, executive style"
  },
  fashion: {
    name: "Fashion Glam ✨",
    prompt: "High fashion editorial style, glamorous lighting, trendy aesthetic, magazine quality, stylish composition, modern elegance"
  },
  food: {
    name: "Food Paradise 🍔",
    prompt: "Delicious gourmet food presentation, appetizing colors, professional food photography, mouth-watering details, restaurant quality"
  },
  tech: {
    name: "Tech Future 🚀",
    prompt: "Futuristic technology, neon lights, cyberpunk aesthetic, holographic effects, digital innovation, sci-fi atmosphere"
  },
  nature: {
    name: "Nature Power 🌿",
    prompt: "Epic natural landscape, dramatic weather, powerful elements, majestic scenery, environmental beauty, organic design"
  }
}

export default function GeneratorPanel({ onGenerate, isGenerating, setIsGenerating, formData, setFormData }) {
  const { url, style, customPrompt } = formData
  const [editingImage, setEditingImage] = useState(null)

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Listen for edit events from Gallery
  useEffect(() => {
    const handleEditImage = (event) => {
      const image = event.detail
      setEditingImage(image)
      setFormData({
        url: image.qrUrl,
        style: image.style,
        customPrompt: ''
      })
    }

    window.addEventListener('editImage', handleEditImage)
    return () => window.removeEventListener('editImage', handleEditImage)
  }, [])

  // Compose images using browser Canvas
  const composeImageInBrowser = async (aiImageUrl, qrCodeDataUrl) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const ctx = canvas.getContext('2d')

      // Load and draw AI background
      const aiImg = new Image()
      aiImg.crossOrigin = 'anonymous'
      aiImg.onload = () => {
        ctx.drawImage(aiImg, 0, 0, 1024, 1024)

        // Add professional text overlay
        addTextOverlay(ctx)

        // Load and draw QR code
        const qrImg = new Image()
        qrImg.onload = () => {
          // Draw QR with border
          const qrSize = 280
          const qrX = 370
          const qrY = 420

          // White background
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)

          // Brown border
          ctx.strokeStyle = '#8B4513'
          ctx.lineWidth = 10
          ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20)

          // QR code
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

          resolve(canvas.toDataURL('image/jpeg', 0.95))
        }
        qrImg.src = qrCodeDataUrl
      }

      if (aiImageUrl) {
        aiImg.src = aiImageUrl
      } else {
        // Demo mode - gradient background
        const gradient = ctx.createLinearGradient(0, 0, 1024, 1024)
        gradient.addColorStop(0, '#FF6B35')
        gradient.addColorStop(1, '#FF3B00')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 1024, 1024)

        // Demo text
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 72px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('DEMO MODE', 512, 200)
        ctx.font = 'bold 48px Arial'
        ctx.fillText('Add FAL_API_KEY', 512, 280)

        aiImg.onload() // Trigger QR loading
      }
    })
  }

  // Add professional text overlay
  const addTextOverlay = (ctx) => {
    // Dark overlay for text visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, 1024, 400)

    // Golden gradient text
    const goldGradient = ctx.createLinearGradient(0, 0, 0, 300)
    goldGradient.addColorStop(0, '#FFD700')
    goldGradient.addColorStop(0.5, '#FFA500')
    goldGradient.addColorStop(1, '#FF8C00')

    // Top text
    ctx.fillStyle = goldGradient
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.font = 'bold 72px Arial'
    ctx.textAlign = 'start'

    const topLine1 = "Parli di"
    const topLine2 = "SALUTE"
    const topLine3 = "DI FERRO?"

    ctx.strokeText(topLine1, 50, 100)
    ctx.fillText(topLine1, 50, 100)

    ctx.font = 'bold 90px Arial'
    ctx.strokeText(topLine2, 50, 180)
    ctx.fillText(topLine2, 50, 180)

    ctx.strokeText(topLine3, 50, 270)
    ctx.fillText(topLine3, 50, 270)

    // Bottom text
    ctx.font = 'bold 48px Arial'
    ctx.fillStyle = '#FFFFFF'

    const bottomLine1 = "SCANNA."
    const bottomLine2 = "TRASFORMA."
    const bottomLine3 = "VIVI."

    ctx.strokeText(bottomLine1, 50, 720)
    ctx.fillText(bottomLine1, 50, 720)

    const fireGradient = ctx.createLinearGradient(0, 750, 0, 800)
    fireGradient.addColorStop(0, '#FF6B35')
    fireGradient.addColorStop(1, '#FF3D00')
    ctx.fillStyle = fireGradient
    ctx.strokeText(bottomLine2, 50, 780)
    ctx.fillText(bottomLine2, 50, 780)

    ctx.fillStyle = '#FFFFFF'
    ctx.strokeText(bottomLine3, 50, 840)
    ctx.fillText(bottomLine3, 50, 840)

    // SCAN QUI center
    ctx.font = 'bold 86px Arial'
    ctx.textAlign = 'center'
    ctx.strokeText("SCAN QUI", 512, 720)
    ctx.fillText("SCAN QUI", 512, 720)

    // Website URL
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(30, 880, 250, 50)
    ctx.font = '24px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.fillText('🌐 salutediferro.com', 155, 912)
  }

  const handleGenerate = async () => {
    if (!url.trim()) return

    setIsGenerating(true)
    localStorage.setItem('qr-fire-generating', 'true')
    try {
      // Correct any typos in custom prompt
      let correctedPrompt = customPrompt
      if (customPrompt) {
        try {
          const correctResponse = await fetch('/api/correct-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: customPrompt })
          })

          if (correctResponse.ok) {
            const { correctedText, hadErrors } = await correctResponse.json()
            correctedPrompt = correctedText
            if (hadErrors) {
              console.log('Auto-corrected text:', customPrompt, '→', correctedText)
            }
          }
        } catch (error) {
          console.log('Text correction skipped:', error.message)
          // Continue with original prompt if correction fails
        }
      }

      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          style: STYLES[style],
          customPrompt: correctedPrompt
        })
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      // Compose images in frontend using Canvas
      const finalImageUrl = await composeImageInBrowser(data.aiImageUrl, data.qrCodeDataUrl)

      const newImage = {
        id: Date.now(),
        url: finalImageUrl,
        qrUrl: data.qrUrl,
        style: style,
        createdAt: new Date().toISOString()
      }

      // Save immediately to localStorage so it persists
      const existing = JSON.parse(localStorage.getItem('qr-fire-gallery') || '[]')
      localStorage.setItem('qr-fire-gallery', JSON.stringify([newImage, ...existing].slice(0, 50)))

      onGenerate(newImage)

      // Reset form
      setFormData({ url: '', style: 'fitness', customPrompt: '' })
      setEditingImage(null) // Clear edit mode
    } catch (error) {
      console.error('Generation error:', error)
      alert(`Errore: ${error.message}`)
    } finally {
      setIsGenerating(false)
      localStorage.removeItem('qr-fire-generating')
    }
  }

  return (
    <div className="generator-panel">
      <div className="generator-header">
        <h2>{editingImage ? '✏️ Modifica Immagine' : 'Genera QR Code Epico'}</h2>
        <p>{editingImage ? 'Modifica il prompt per rigenerare con Claude AI' : 'Crea grafiche stunning con QR code integrato'}</p>
        {editingImage && (
          <button
            onClick={() => {
              setEditingImage(null);
              setFormData({ url: '', style: 'fitness', customPrompt: '' });
            }}
            className="cancel-edit"
          >
            ← Torna alla creazione
          </button>
        )}
      </div>

      <div className="generator-form">
        <div className="form-group">
          <label>URL per QR Code</label>
          <input
            type="text"
            placeholder="https://tuosito.com o @tuosocial"
            value={url}
            onChange={(e) => updateFormData('url', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Scegli Stile</label>
          <div className="style-grid">
            {Object.entries(STYLES).map(([key, value]) => (
              <button
                key={key}
                className={`style-option ${style === key ? 'active' : ''}`}
                onClick={() => updateFormData('style', key)}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Personalizza (Opzionale)</label>
          <textarea
            placeholder="Aggiungi dettagli specifici... es: colori rosso e oro, stile minimalista"
            value={customPrompt}
            onChange={(e) => updateFormData('customPrompt', e.target.value)}
            rows={3}
          />
        </div>

        <button
          className="generate-button"
          onClick={handleGenerate}
          disabled={isGenerating || !url.trim()}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              {editingImage ? 'Rigenerando...' : 'Generazione in corso...'}
            </>
          ) : (
            <>{editingImage ? '🔄 Rigenera con Claude AI' : '🚀 Genera QR Fire'}</>
          )}
        </button>
      </div>

      <style jsx>{`
        .generator-panel {
          max-width: 800px;
          margin: 0 auto;
        }

        .generator-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .generator-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ff6b35 0%, #ffd700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .generator-header p {
          color: #666;
          font-size: 1.125rem;
        }

        .generator-form {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #999;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #ff6b35;
          background: rgba(255, 255, 255, 0.08);
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .style-option {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: #999;
          padding: 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .style-option:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .style-option.active {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 59, 0, 0.2) 100%);
          border-color: #ff6b35;
          color: #ff6b35;
        }

        .generate-button {
          width: 100%;
          background: linear-gradient(135deg, #ff6b35 0%, #ff3b00 100%);
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
        }

        .generate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .cancel-edit {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #999;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-edit:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        @media (max-width: 768px) {
          .style-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}