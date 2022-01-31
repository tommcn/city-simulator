import { sleep } from "./helpers";
import { Actor } from "./thing";

export class LightActor extends Actor {
    on: boolean;

    constructor() {
        super();
        this.on = false;
    }

    async tick(): Promise<boolean> {
        return true;
    }

    public async turnOn(): Promise<boolean> {
        // await sleep(1 * 500); // Busy work
        this.on = true;
        return true;
    }

    public async turnOff(): Promise<boolean> {
        // await sleep(1 * 500); // Busy work
        this.on = false;
        return true;
    }
}
