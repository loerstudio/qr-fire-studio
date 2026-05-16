'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="landing">
      <nav>
        <div className="nav-container">
          <h1 className="logo">🔥 QR Fire Studio</h1>
          <Link href="/dashboard" className="cta-button">Start Free</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h2>Crea QR Code <span>EPICI</span> con AI</h2>
          <p>Grafiche stunning stile fitness/motivazionale con QR integrato</p>
          <div className="hero-buttons">
            <Link href="/dashboard" className="main-cta">
              Inizia Gratis →
            </Link>
            <span className="price-tag">Solo €9/mese dopo trial</span>
          </div>
        </div>
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-badge">AI Generated</div>
            <img src="/api/placeholder/400/400" alt="QR Code Example" />
          </div>
        </div>
      </section>

      <section className="features">
        <h3>Come Funziona</h3>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">1️⃣</span>
            <h4>Inserisci il tuo link</h4>
            <p>Website, menu, social, qualsiasi URL</p>
          </div>
          <div className="feature">
            <span className="feature-icon">2️⃣</span>
            <h4>Scegli lo stile</h4>
            <p>Fitness, Business, Fashion, Food</p>
          </div>
          <div className="feature">
            <span className="feature-icon">3️⃣</span>
            <h4>Genera con AI</h4>
            <p>Grafica epica pronta in 10 secondi</p>
          </div>
        </div>
      </section>

      <section className="pricing">
        <h3>Prezzo Semplice</h3>
        <div className="pricing-card">
          <h4>QR Fire Pro</h4>
          <div className="price">€9<span>/mese</span></div>
          <ul>
            <li>✓ QR Code illimitati</li>
            <li>✓ Tutti gli stili premium</li>
            <li>✓ Download HD</li>
            <li>✓ Nessun watermark</li>
            <li>✓ Supporto prioritario</li>
          </ul>
          <Link href="/dashboard" className="pricing-cta">
            Prova 7 Giorni Gratis
          </Link>
        </div>
      </section>

      <style jsx>{`
        .landing {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
        }

        nav {
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .cta-button {
          background: linear-gradient(135deg, #ff6b35 0%, #ff3b00 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .cta-button:hover {
          transform: scale(1.05);
        }

        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content h2 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .hero-content h2 span {
          background: linear-gradient(135deg, #ff6b35 0%, #ffd700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: #999;
          margin-bottom: 2rem;
        }

        .hero-buttons {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .main-cta {
          background: linear-gradient(135deg, #ff6b35 0%, #ff3b00 100%);
          color: white;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-size: 1.125rem;
          font-weight: 700;
          display: inline-block;
          transition: all 0.2s;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        }

        .main-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
        }

        .price-tag {
          color: #666;
          font-size: 0.875rem;
        }

        .hero-preview {
          position: relative;
        }

        .preview-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preview-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 107, 53, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 10;
        }

        .preview-card img {
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }

        .features {
          background: rgba(255, 255, 255, 0.02);
          padding: 5rem 2rem;
        }

        .features h3 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
        }

        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .feature {
          background: rgba(255, 255, 255, 0.05);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .feature:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .feature h4 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .feature p {
          color: #999;
        }

        .pricing {
          padding: 5rem 2rem;
          text-align: center;
        }

        .pricing h3 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 3rem;
        }

        .pricing-card {
          max-width: 400px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 59, 0, 0.1) 100%);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 1rem;
          padding: 3rem 2rem;
        }

        .pricing-card h4 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .price {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 2rem;
        }

        .price span {
          font-size: 1rem;
          color: #999;
        }

        .pricing-card ul {
          list-style: none;
          margin-bottom: 2rem;
        }

        .pricing-card li {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pricing-cta {
          background: linear-gradient(135deg, #ff6b35 0%, #ff3b00 100%);
          color: white;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 700;
          display: inline-block;
          width: 100%;
          transition: all 0.2s;
        }

        .pricing-cta:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-content h2 {
            font-size: 2.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}