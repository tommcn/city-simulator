import { readFile } from "fs/promises";
import YAML from "yaml";

import { StreetLamp, WeatherStation } from "./things";

const interval = 0.1; // seconds

// TODO: set up YAML schema instead
interface Config {
    devices: {
        weather_stations: {
            name: string;
        }[];
        street_lights: {
            name: string;
        }[];
    };
}

export async function initDevices() {
    const config = YAML.parse(
        await readFile("./devices.yml", "utf8")
    ) as Config;

    for (const ws of config.devices.weather_stations) {
        const created = new WeatherStation(ws.name);
        setInterval(async () => {
            await created.tick();
        }, interval * 1000);
        console.log("Created weather station:", created.name);
    }

    for (const sl of config.devices.street_lights) {
        const created = new StreetLamp(sl.name);
        setInterval(async () => {
            await created.tick();
        });
        console.log("Created street lamp:", created.name);
    }
}
