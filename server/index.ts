import { Server } from "socket.io";

import { StreetLamp } from "../things";
import { WeatherStation } from "../things";
import { saveDeviceState, setUp } from "./db";
import { Devices } from "./types";

const devices: Devices = {
    sls: [new StreetLamp(), new StreetLamp()],
    wss: [new WeatherStation()],
};

export async function startServer(): Promise<void> {
    const io = new Server({
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    await setUp("user", "password", "org", "bucket");
    setInterval(async () => {
        const values = await Promise.all([
            devices.sls.map((sl) => sl.tick()),
            devices.wss.map((ws) => ws.tick()),
        ]);
        saveDeviceState(devices);
    }, 0.1 * 1000);

    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        socket.emit("hello", "world");

        socket.on("ping", (data) => {
            console.log("ping", data);
            socket.emit("pong", data);
        });

        socket.on("addStreetlamp", (data) => {
            devices.sls.push(new StreetLamp());
            socket.emit("streetLampAdded");
        });

        socket.on("removeStreetlamp", (data) => {
            devices.sls.pop();
            socket.emit("streetLampRemoved");
        });
        setInterval(async () => {
            socket.emit("tick", devices);
        }, 0.1 * 1000);
    });
    const port = parseInt(process.env.PORT || "8080");
    io.listen(port);
    console.log(`Listening on port ${port}`);
}
