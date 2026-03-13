export interface IncidentRecord {
  eventId: string;
  processedAt: string;
  queueName: string;
  priority: "high" | "medium" | "low";
  action: string;
  payload: {
    labId: string;
    reportedBy: "student" | "assistant" | "technician";
    incidentType:
      | "device_overheat"
      | "network_unstable"
      | "water_leak"
      | "projector_failure"
      | "minor_noise";
    severityHint: number;
    description: string;
  };
}

export interface Stats {
  total: number;
  byPriority: { high: number; medium: number; low: number };
  byType: Record<string, number>;
}

const API_BASE = "http://localhost:3000";

export async function fetchProcessedIncidents(): Promise<IncidentRecord[]> {
  const res = await fetch(`${API_BASE}/api/incidents/processed`);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  const data = await res.json();
  return data.data;
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/api/incidents/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function submitIncident(payload: {
  labId: string;
  reportedBy: "student" | "assistant" | "technician";
  incidentType: string;
  severityHint: number;
  description: string;
}) {
  const res = await fetch(`${API_BASE}/api/incidents`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}
