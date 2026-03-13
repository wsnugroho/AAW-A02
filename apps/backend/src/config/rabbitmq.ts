import amqp from "amqplib";
import { type LabIncidentReportedEvent } from "../models/lab-incident";

export const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

export async function createChannel(queueName: string) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  return { connection, channel };
}

export async function publishIncidentEvent(event: LabIncidentReportedEvent) {
  const { connection, channel } = await createChannel(event.type);

  channel.sendToQueue(event.type, Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });

  await channel.close();
  await connection.close();
}
