import { sleep } from "./helpers";
import { Sensor } from "./thing";

export class TemperatureSensor extends Sensor {
    /**
     * The temperature as read by the sensor in degrees Celsius
     */
    temperature: number;

    constructor() {
        super();
        this.temperature = NaN;
    }

    async tick(): Promise<boolean> {
        const value = Math.floor(Math.random() * 100);
        this.temperature = value;

        await sleep(1 * 1000); // Busy work

        return true;
    }

    /**
     * Get a human-readable interpretation of the temperature value from the raw sensor data
     * @example
     * // returns ['Temperature: 1 °C', 'Temperature: 2 °C']
     * interpretResults([1, 2])
     * @param results The results of the temperature sensor readings, as from the value getter
     * @returns A human-readable interpretation of the results
     */
    public interpretResults(results: number[]): string[] {
        const intepretations: string[] = results.map(
            (el) => `Temperature: ${el} °C`
        );
        return intepretations;
    }

    public get value(): number {
        return this.temperature;
    }
}
