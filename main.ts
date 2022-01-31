import {
    PresenceSensor,
    TemperatureSensor,
    LightActor,
    Sensor,
    Actor,
    StreetLamp,
} from "./things";
import { Server } from "socket.io";

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

    const sl = new StreetLamp();
})();

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("New connection:", socket.id);
    socket.emit("hello", "world");
    socket.on("ping", (data) => {
        console.log("ping", data);
        socket.emit("pong", data);
    });
});

io.listen(8000);
