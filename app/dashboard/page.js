'use client'

import { useState, useEffect } from 'react'
import GeneratorPanel from '../components/GeneratorPanel'
import Gallery from '../components/Gallery'

export default function Dashboard() {
  const [generations, setGenerations] = useState([])
  const [activeTab, setActiveTab] = useState('generate')
  const [isGenerating, setIsGenerating] = useState(false)

  // Load saved images from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('qr-fire-gallery')
    if (saved) {
      try {
        setGenerations(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load gallery:', e)
      }
    }
    // Check if there's an ongoing generation
    const generating = localStorage.getItem('qr-fire-generating')
    if (generating === 'true') {
      setIsGenerating(true)
    }
  }, [])

  // Poll for generation completion
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        const stillGenerating = localStorage.getItem('qr-fire-generating')
        if (stillGenerating !== 'true') {
          setIsGenerating(false)
          // Reload gallery
          const saved = localStorage.getItem('qr-fire-gallery')
          if (saved) {
            try {
              setGenerations(JSON.parse(saved))
            } catch (e) {
              console.error('Failed to reload gallery:', e)
            }
          }
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isGenerating])

  // Save to localStorage whenever generations change
  useEffect(() => {
    if (generations.length > 0) {
      localStorage.setItem('qr-fire-gallery', JSON.stringify(generations))
    }
  }, [generations])

  const handleNewGeneration = (image) => {
    setGenerations(prev => {
      const updated = [image, ...prev]
      // Limit to 50 images to avoid localStorage limits
      return updated.slice(0, 50)
    })
    // Switch to gallery to show the new image
    setActiveTab('gallery')
  }

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <h1 className="dash-logo">🔥 QR Fire Studio</h1>
        <div className="nav-tabs">
          <button
            className={activeTab === 'generate' ? 'active' : ''}
            onClick={() => setActiveTab('generate')}
          >
            Generate {isGenerating && '🔄'}
          </button>
          <button
            className={activeTab === 'gallery' ? 'active' : ''}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery ({generations.length})
          </button>
        </div>
        <div className="user-menu">
          <span>Free Trial</span>
        </div>
      </nav>

      <main className="dash-main">
        {activeTab === 'generate' ? (
          <GeneratorPanel
            onGenerate={handleNewGeneration}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        ) : (
          <Gallery images={generations} />
        )}
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #0a0a0a;
          color: white;
        }

        .dash-nav {
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dash-logo {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .nav-tabs {
          display: flex;
          gap: 1rem;
        }

        .nav-tabs button {
          background: transparent;
          color: #666;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .nav-tabs button:hover {
          color: #999;
        }

        .nav-tabs button.active {
          background: linear-gradient(135deg, #ff6b35 0%, #ff3b00 100%);
          color: white;
        }

        .user-menu {
          background: rgba(255, 107, 53, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 107, 53, 0.3);
        }

        .dash-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }
      `}</style>
    </div>
  )
}