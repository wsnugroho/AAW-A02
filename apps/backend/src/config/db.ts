import { Database } from "bun:sqlite";
import path from "node:path";
import { mkdirSync } from "node:fs";

const runtimeDir = path.resolve(process.cwd(), "runtime");
mkdirSync(runtimeDir, { recursive: true });

const dbPath = path.join(runtimeDir, "incidents.db");

export const db = new Database(dbPath, { create: true });

db.run("PRAGMA journal_mode = WAL;");

db.run(`
  CREATE TABLE IF NOT EXISTS processed_incidents (
    eventId TEXT PRIMARY KEY,
    processedAt TEXT NOT NULL,
    queueName TEXT NOT NULL,
    labId TEXT NOT NULL,
    reportedBy TEXT NOT NULL,
    incidentType TEXT NOT NULL,
    severityHint INTEGER NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    action TEXT NOT NULL
  );
`);
