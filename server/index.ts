import { setUp } from "./db";

export async function startServer(): Promise<void> {
    // Set up InfluxDB
    await setUp("user", "password", "org", "bucket");

    // TODO: Start MQTT
}
