import { StreetLamp } from "../things";
import { Server } from "socket.io";

const sl = new StreetLamp();
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

        setInterval(async () => {
            await sl.tick();
            socket.emit("tick", { sls: [sl] });
        }, 0.1 * 1000);
    });

    io.listen(parseInt(process.env.PORT || "3000"));
}
