import { StreetLamp } from "../things";
import { Server } from "socket.io";
import { WeatherStation } from "../things";

const devices = {
    sls: [new StreetLamp(), new StreetLamp()],
    wss: [new WeatherStation()],
};

export function startServer(): void {
    const io = new Server({
        cors: {
            origin: "*",
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

        socket.on("addStreetlamp", (data) => {
            devices.sls.push(new StreetLamp());
            socket.emit("streetLampAdded");
        });

        socket.on("removeStreetlamp", (data) => {
            devices.sls.pop();
            socket.emit("streetLampRemoved");
        });

        setInterval(async () => {
            const values = await Promise.all([
                devices.sls.map((sl) => sl.tick()),
                devices.wss.map((ws) => ws.tick()),
            ]);

            socket.emit("tick", devices);
        }, 0.1 * 1000);
    });

    io.listen(parseInt(process.env.PORT || "8000"));
}
