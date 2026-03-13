import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchStats, fetchProcessedIncidents } from "../api";

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 5000,
  });

  const { data: records, isLoading: recordsLoading, error: recordsError } = useQuery({
    queryKey: ["incidents", "recent"],
    queryFn: fetchProcessedIncidents,
    refetchInterval: 5000,
  });

  const loading = statsLoading || recordsLoading;
  const error = statsError || recordsError;

  if (loading) return <div className="loader-container"><div className="loader" /></div>;
  if (error) return <div className="error-banner">⚠ {error instanceof Error ? error.message : "Error"}</div>;

  const priorityColors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  const recent = records?.slice(0, 5) || [];

  return (
    <main className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Real-time overview of campus lab incidents via RabbitMQ</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card-total">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats?.total ?? 0}</div>
          <div className="stat-label">Total Processed</div>
        </div>
        <div className="stat-card" style={{ borderColor: "#ef4444" }}>
          <div className="stat-icon">🔴</div>
          <div className="stat-value" style={{ color: "#ef4444" }}>
            {stats?.byPriority.high ?? 0}
          </div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="stat-card" style={{ borderColor: "#f59e0b" }}>
          <div className="stat-icon">🟡</div>
          <div className="stat-value" style={{ color: "#f59e0b" }}>
            {stats?.byPriority.medium ?? 0}
          </div>
          <div className="stat-label">Medium Priority</div>
        </div>
        <div className="stat-card" style={{ borderColor: "#22c55e" }}>
          <div className="stat-icon">🟢</div>
          <div className="stat-value" style={{ color: "#22c55e" }}>
            {stats?.byPriority.low ?? 0}
          </div>
          <div className="stat-label">Low Priority</div>
        </div>
      </div>

      {stats && Object.keys(stats.byType).length > 0 && (
        <div className="section">
          <h2>Incidents by Type</h2>
          <div className="type-bars">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="type-bar-row">
                <span className="type-label">{type.replace(/_/g, " ")}</span>
                <div className="type-bar-track">
                  <div
                    className="type-bar-fill"
                    style={{
                      width: `${Math.min(100, (count / (stats.total || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>Recent Incidents</h2>
          <Link to="/incidents" className="view-all-link">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <p>No incidents yet</p>
          </div>
        ) : (
          <div className="incident-list">
            {recent.map((r) => (
              <div key={r.eventId} className="incident-card">
                <div className="incident-left">
                  <span
                    className="priority-badge"
                    style={{ background: priorityColors[r.priority] }}
                  >
                    {r.priority.toUpperCase()}
                  </span>
                  <div>
                    <div className="incident-title">
                      {r.payload.labId} — {r.payload.incidentType.replace(/_/g, " ")}
                    </div>
                    <div className="incident-meta">
                      by {r.payload.reportedBy} · {new Date(r.processedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="incident-action">{r.action}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
