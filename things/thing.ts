import { v4 as uuidv4 } from "uuid";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export abstract class Thing {
    protected _id: string;
    constructor() {
        this._id = uuidv4();
    }

    abstract tick(): void;
}

export class TemperatureSensor extends Thing {
    temperature: number;
    constructor() {
        super();
        this.temperature = NaN;
    }

    async tick(): Promise<boolean> {
        const value = await this.getTemperature();
        this.temperature = value;

        await sleep(1 * 1000); // Busy work

        return true;
    }

    async getTemperature(): Promise<number> {
        return Math.floor(Math.random() * 100);
    }
}
