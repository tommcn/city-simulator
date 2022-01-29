import {
    PresenceSensor,
    TemperatureSensor,
    StreetlightActor,
    Sensor,
    Actor,
} from "./things";

const sensors: Sensor[] = [];
const actors: StreetlightActor[] = [];

for (let i = 0; i < 10; i++) {
    sensors.push(new TemperatureSensor());
    sensors.push(new PresenceSensor());
}

actors.push(new StreetlightActor());

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

    await Promise.all(actors.map((actor) => actor.turnOn()));
})();
