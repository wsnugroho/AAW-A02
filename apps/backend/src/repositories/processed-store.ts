import { db } from "../config/db";
import { type ProcessedIncidentRecord } from "../models/lab-incident";

export async function loadProcessedIncidents(): Promise<ProcessedIncidentRecord[]> {
  const rows = db
    .query<
      {
        eventId: string;
        processedAt: string;
        queueName: string;
        labId: string;
        reportedBy: string;
        incidentType: string;
        severityHint: number;
        description: string;
        priority: string;
        action: string;
      },
      []
    >(
      `SELECT * FROM processed_incidents ORDER BY processedAt DESC`,
    )
    .all();

  return rows.map((row) => ({
    eventId: row.eventId,
    processedAt: row.processedAt,
    queueName: row.queueName,
    priority: row.priority as ProcessedIncidentRecord["priority"],
    action: row.action,
    payload: {
      labId: row.labId,
      reportedBy: row.reportedBy as ProcessedIncidentRecord["payload"]["reportedBy"],
      incidentType: row.incidentType as ProcessedIncidentRecord["payload"]["incidentType"],
      severityHint: row.severityHint,
      description: row.description,
    },
  }));
}

export async function saveProcessedIncident(record: ProcessedIncidentRecord) {
  db.run(
    `INSERT OR REPLACE INTO processed_incidents
     (eventId, processedAt, queueName, labId, reportedBy, incidentType, severityHint, description, priority, action)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.eventId,
      record.processedAt,
      record.queueName,
      record.payload.labId,
      record.payload.reportedBy,
      record.payload.incidentType,
      record.payload.severityHint,
      record.payload.description,
      record.priority,
      record.action,
    ],
  );
}
