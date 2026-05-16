'use client'

import { useState } from 'react'
import GeneratorPanel from '../components/GeneratorPanel'
import Gallery from '../components/Gallery'

export default function Dashboard() {
  const [generations, setGenerations] = useState([])
  const [activeTab, setActiveTab] = useState('generate')

  const handleNewGeneration = (image) => {
    setGenerations(prev => [image, ...prev])
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
            Generate
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
          <GeneratorPanel onGenerate={handleNewGeneration} />
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