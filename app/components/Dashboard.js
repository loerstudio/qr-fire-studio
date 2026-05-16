'use client'

export default function Dashboard() {
  const stats = {
    totalGenerated: 1247,
    todayGenerated: 42,
    activeUsers: 89,
    satisfaction: 98
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>QR Studio AI</h1>
        <div className="user-info">
          <div className="avatar">JD</div>
          <div>
            <div className="username">John Doe</div>
            <div className="role">Pro Account</div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-value">{stats.totalGenerated.toLocaleString()}</div>
          <div className="stat-label">Grafiche Generate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.todayGenerated}</div>
          <div className="stat-label">Oggi</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.activeUsers}</div>
          <div className="stat-label">Utenti Online</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.satisfaction}%</div>
          <div className="stat-label">Soddisfazione</div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Attività Recente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-dot"></span>
            <span>QR Code per ristorante generato</span>
            <span className="activity-time">2 min fa</span>
          </div>
          <div className="activity-item">
            <span className="activity-dot"></span>
            <span>Grafica evento creata</span>
            <span className="activity-time">15 min fa</span>
          </div>
          <div className="activity-item">
            <span className="activity-dot"></span>
            <span>QR menu digitale completato</span>
            <span className="activity-time">1 ora fa</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          width: 350px;
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          overflow-y: auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 0.75rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .username {
          font-weight: 600;
          color: #333;
        }

        .role {
          font-size: 0.875rem;
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .recent-activity h3 {
          font-size: 1rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
        }

        .activity-time {
          margin-left: auto;
          font-size: 0.75rem;
          color: #999;
        }
      `}</style>
    </div>
  )
}