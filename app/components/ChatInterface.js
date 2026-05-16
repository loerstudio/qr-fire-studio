'use client'

import { useState, useRef } from 'react'

export default function ChatInterface({ messages, onSendMessage, isGenerating }) {
  const [inputText, setInputText] = useState('')
  const [imageRef, setImageRef] = useState(null)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputText.trim() && !isGenerating) {
      onSendMessage(inputText, imageRef)
      setInputText('')
      setImageRef(null)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageRef(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageRef(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Genera QR Code con AI</h2>
        <p>Descrivi cosa vuoi creare e il link per il QR</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Inizia una conversazione</h3>
            <p>Esempio: "Crea un QR code per il mio ristorante www.esempio.com con tema elegante e colori caldi"</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                {message.imageRef && message.type === 'user' && (
                  <img src={message.imageRef} alt="Reference" className="reference-image" />
                )}
                {message.image && message.type === 'assistant' && (
                  <div className="generated-image-container">
                    <img src={message.image} alt="Generated" className="generated-image" />
                    <a href={message.image} download className="download-btn">
                      ⬇️ Scarica
                    </a>
                  </div>
                )}
                <div className="message-time">{message.timestamp}</div>
              </div>
            </div>
          ))
        )}
        {isGenerating && (
          <div className="message assistant">
            <div className="message-content">
              <div className="generating">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="message-text">Sto generando la tua grafica...</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        {imageRef && (
          <div className="image-preview">
            <img src={imageRef} alt="Preview" />
            <button type="button" onClick={removeImage} className="remove-image">×</button>
          </div>
        )}
        <div className="input-row">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="attach-btn"
            disabled={isGenerating}
          >
            📎
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Descrivi la grafica e inserisci il link per il QR..."
            disabled={isGenerating}
          />
          <button type="submit" disabled={isGenerating || !inputText.trim()} className="send-btn">
            {isGenerating ? '⏳' : '➤'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .chat-interface {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.98);
          margin-left: 1rem;
          border-radius: 1rem;
          overflow: hidden;
        }

        .chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .chat-header h2 {
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .chat-header p {
          color: #666;
          font-size: 0.875rem;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #666;
          max-width: 400px;
          line-height: 1.5;
        }

        .message {
          margin-bottom: 1.5rem;
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 1rem;
          border-radius: 1rem;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .message.assistant .message-content {
          background: #f3f4f6;
          color: #333;
        }

        .message-text {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .reference-image,
        .generated-image {
          width: 100%;
          max-width: 300px;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }

        .generated-image-container {
          position: relative;
        }

        .download-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #333;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .generating {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .generating span {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .generating span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .generating span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .input-container {
          padding: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .image-preview {
          position: relative;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .image-preview img {
          height: 60px;
          border-radius: 0.5rem;
        }

        .remove-image {
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
        }

        .input-row {
          display: flex;
          gap: 0.75rem;
        }

        .attach-btn {
          padding: 0.75rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1.25rem;
          transition: background 0.2s;
        }

        .attach-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .input-row input[type="text"] {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
        }

        .send-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1.25rem;
          transition: opacity 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .send-btn:disabled,
        .attach-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}