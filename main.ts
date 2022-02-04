import { initDevices } from "./devices";
import { startServer } from "./server";

(async () => {
    await initDevices();
    await startServer();
})();
