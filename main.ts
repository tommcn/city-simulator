import { PresenceSensor, TemperatureSensor, Sensor } from "./things";

const sensors: Sensor[] = [];

for (let i = 0; i < 10; i++) {
    sensors.push(new TemperatureSensor());
    sensors.push(new PresenceSensor());
}

(async () => {
    // Run all ticks at the same time
    const values = await Promise.all(sensors.map((sensor) => sensor.tick()));

    // Remove duplicates
    const unique = new Set(values);

    if (unique.has(false)) {
        // TODO: get sensors that failed
        console.log("Some sensors failed");
    } else {
        console.log("All sensors succeeded");
    }
})();
