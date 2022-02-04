import { StreetLamp } from "../things";
import { WeatherStation } from "../things";
import { saveDeviceState, setUp } from "./db";
import { Devices } from "./types";

const devices: Devices = {
    sls: [new StreetLamp("sl-1"), new StreetLamp("sl-2")],
    wss: [new WeatherStation("ws-1")],
};

export async function startServer(): Promise<void> {
    await setUp("user", "password", "org", "bucket");
    setInterval(async () => {
        const values = await Promise.all([
            devices.sls.map((sl) => sl.tick()),
            devices.wss.map((ws) => ws.tick()),
        ]);
        saveDeviceState(devices);
    }, 0.1 * 1000);
}
