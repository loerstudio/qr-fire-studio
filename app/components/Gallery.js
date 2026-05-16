'use client'

export default function Gallery({ images }) {
  if (images.length === 0) {
    return (
      <div className="empty-gallery">
        <h3>Nessuna generazione ancora</h3>
        <p>Le tue creazioni appariranno qui</p>
        <style jsx>{`
          .empty-gallery {
            text-align: center;
            padding: 4rem;
            color: #666;
          }

          .empty-gallery h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={image.url} alt="Generated QR" />
            <div className="gallery-overlay">
              <div className="gallery-info">
                <span className="gallery-style">{image.style}</span>
                <span className="gallery-url">{image.qrUrl}</span>
              </div>
              <a href={image.url} download className="download-btn">
                ⬇️ Download
              </a>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .gallery {
          padding: 2rem 0;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .gallery-item {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .gallery-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(255, 107, 53, 0.2);
        }

        .gallery-item img {
          width: 100%;
          height: auto;
          display: block;
        }

        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 1.5rem;
          transform: translateY(100%);
          transition: transform 0.3s;
        }

        .gallery-item:hover .gallery-overlay {
          transform: translateY(0);
        }

        .gallery-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .gallery-style {
          background: rgba(255, 107, 53, 0.2);
          color: #ff6b35;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
        }

        .gallery-url {
          color: #999;
          font-size: 0.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .download-btn {
          background: linear-gradient(135deg, #ff6b35 0%, #ff3b00 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.2s;
        }

        .download-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}