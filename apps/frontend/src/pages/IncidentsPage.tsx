import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProcessedIncidents } from "../api";

export function IncidentsPage() {
  const [filter, setFilter] = React.useState<"all" | "high" | "medium" | "low">("all");

  const { data: records, isLoading, error } = useQuery({
    queryKey: ["incidents", "all"],
    queryFn: fetchProcessedIncidents,
    refetchInterval: 5000,
  });

  const priorityColors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  const filtered = records
    ? filter === "all"
      ? records
      : records.filter((r) => r.priority === filter)
    : [];

  if (isLoading) return <div className="loader-container"><div className="loader" /></div>;
  if (error) return <div className="error-banner">⚠ {error instanceof Error ? error.message : "Error"}</div>;

  return (
    <main className="page">
      <div className="page-header">
        <h1>All Incidents</h1>
        <p className="page-subtitle">{records?.length || 0} incidents stored in database</p>
      </div>

      <div className="filter-bar">
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No incidents to show.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="incidents-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Lab</th>
                <th>Type</th>
                <th>Reported By</th>
                <th>Severity</th>
                <th>Action</th>
                <th>Processed At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.eventId}>
                  <td>
                    <span
                      className="priority-badge"
                      style={{ background: priorityColors[r.priority] }}
                    >
                      {r.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="font-mono">{r.payload.labId}</td>
                  <td>{r.payload.incidentType.replace(/_/g, " ")}</td>
                  <td>{r.payload.reportedBy}</td>
                  <td>
                    <div className="severity-dots">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`severity-dot${i < r.payload.severityHint ? " filled" : ""}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="action-cell">{r.action}</td>
                  <td className="timestamp">{new Date(r.processedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
