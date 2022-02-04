import { sleep } from "./helpers";
import { Sensor } from "./thing";

export class PresenceSensor extends Sensor {
    /**
     * Whether the sensor is currently detecting presence
     */
    presence: boolean;

    constructor(name: string) {
        super(name);
        this.presence = false;
    }

    async tick(): Promise<boolean> {
        const value = Math.random() < 0.5;
        this.presence = value;

        // await sleep(1 * 1000); // Busy work

        return true;
    }

    public interpretResults(results: boolean[]): string[] {
        const intepretations: string[] = results.map((el) =>
            el ? "Presence detected" : "No presence detected"
        );
        return intepretations;
    }

    public get value(): boolean {
        return this.presence;
    }
}
