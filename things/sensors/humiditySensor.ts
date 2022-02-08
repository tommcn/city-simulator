import { Sensor } from "..";

export class HumiditySensor extends Sensor {
    humidity: number;

    constructor(name: string) {
        super(name);
        this.humidity = NaN;
    }

    async tick(): Promise<boolean> {
        const value = Math.floor(Math.random() * 100);
        this.humidity = value;

        return true;
    }

    public interpretResults(results: number[]): string[] {
        const intepretations: string[] = results.map(
            (el) => `Humidity: ${el}%`
        );
        return intepretations;
    }

    public get value(): number {
        return this.humidity;
    }
}
