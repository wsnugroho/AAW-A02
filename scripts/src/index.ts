import {
  sampleIncidents,
} from "../../apps/backend/src/models/lab-incident";

async function main() {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3000";

  console.log(`[producer] publishing incidents through ${apiBaseUrl}/api/incidents`);

  for (const incident of sampleIncidents) {
    const response = await fetch(`${apiBaseUrl}/api/incidents`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(incident),
    });
    const body = (await response.json()) as {
      event?: { eventId: string; type: string };
      message?: string;
    };

    console.log(
      `[producer] status=${response.status} event=${body.event?.eventId ?? "unknown"} lab=${incident.labId} type=${incident.incidentType}`,
    );

    await Bun.sleep(400);
  }

  console.log("[producer] finished sending sample incident requests");
}

main().catch((error) => {
  console.error("[producer] failed:", error);
  process.exit(1);
});
