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

export default function GeneratorPanel({ onGenerate }) {
  const [url, setUrl] = useState('')
  const [style, setStyle] = useState('fitness')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingImage, setEditingImage] = useState(null)

  // Listen for edit events from Gallery
  useEffect(() => {
    const handleEditImage = (event) => {
      const image = event.detail
      setEditingImage(image)
      setUrl(image.qrUrl)
      setStyle(image.style)
      setCustomPrompt('') // Reset for new edit
    }

    window.addEventListener('editImage', handleEditImage)
    return () => window.removeEventListener('editImage', handleEditImage)
  }, [])

  const handleGenerate = async () => {
    if (!url.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          style: STYLES[style],
          customPrompt
        })
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      onGenerate({
        id: Date.now(),
        url: data.imageUrl,
        qrUrl: url,
        style: style,
        createdAt: new Date().toISOString()
      })

      // Reset form
      setUrl('')
      setCustomPrompt('')
      setEditingImage(null) // Clear edit mode
    } catch (error) {
      console.error('Generation error:', error)
      alert(`Errore: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="generator-panel">
      <div className="generator-header">
        <h2>{editingImage ? '✏️ Modifica Immagine' : 'Genera QR Code Epico'}</h2>
        <p>{editingImage ? 'Modifica il prompt per rigenerare con Claude AI' : 'Crea grafiche stunning con QR code integrato'}</p>
        {editingImage && (
          <button
            onClick={() => { setEditingImage(null); setUrl(''); setCustomPrompt(''); }}
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
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Scegli Stile</label>
          <div className="style-grid">
            {Object.entries(STYLES).map(([key, value]) => (
              <button
                key={key}
                className={`style-option ${style === key ? 'active' : ''}`}
                onClick={() => setStyle(key)}
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
            onChange={(e) => setCustomPrompt(e.target.value)}
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