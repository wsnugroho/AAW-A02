import {
  classifyIncident,
  INCIDENT_QUEUE,
  type LabIncidentReportedEvent,
} from "../models/lab-incident";
import { saveProcessedIncident } from "../repositories/processed-store";
import { createChannel } from "../config/rabbitmq";

export async function startConsumerWorker() {
  try {
    const { channel, connection } = await createChannel(INCIDENT_QUEUE);
    await channel.prefetch(1);

    console.log(`[consumer] waiting for events on "${INCIDENT_QUEUE}"`);

    process.on("SIGINT", async () => {
      await channel.close();
      await connection.close();
      process.exit(0);
    });

    await channel.consume(
      INCIDENT_QUEUE,
      async (message) => {
        if (!message) return;

        try {
          const event = JSON.parse(
            message.content.toString(),
          ) as LabIncidentReportedEvent;
          const result = classifyIncident(event.payload);

          console.log(
            `[consumer] received ${event.type} (${event.eventId}) from ${event.payload.labId}`,
          );
          
          await Bun.sleep(1200); // Simulate processing time

          await saveProcessedIncident({
            eventId: event.eventId,
            processedAt: new Date().toISOString(),
            queueName: INCIDENT_QUEUE,
            payload: event.payload,
            ...result,
          });

          console.log(
            `[consumer] classified priority=${result.priority}; action=${result.action}`,
          );
          channel.ack(message);
        } catch (err) {
          console.error("[consumer] error processing message", err);
          channel.reject(message, false);
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("[consumer] failed to start:", error);
    // Let it retry or fail gracefully without bringing down the API
    setTimeout(startConsumerWorker, 5000);
  }
}
