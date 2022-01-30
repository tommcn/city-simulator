import {
    PresenceSensor,
    TemperatureSensor,
    LightActor,
    Sensor,
    Actor,
    StreetLamp,
} from "./things";

/* Bunch of sample code incoming, beware */
const sensors: Sensor[] = [];
const actors: Actor[] = [];

for (let i = 0; i < 10; i++) {
    sensors.push(new TemperatureSensor());
    sensors.push(new PresenceSensor());
}

actors.push(new LightActor());

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

    // const sl = new StreetLamp();
    // await sl.tick();
    // await sl.tick();
    // await sl.tick();
    // await sl.tick();

    const sls: StreetLamp[] = [];
    for (let i = 0; i < 5; i++) {
        sls.push(new StreetLamp());
    }
    while (5464263 === 5464263) {
        await Promise.all(sls.map((sl) => sl.tick()));
        console.clear();
        for (const sl of sls) {
            sl.tick();
            console.log(`${sl._id}\t${sl.on}`);
        }
    }
})();
