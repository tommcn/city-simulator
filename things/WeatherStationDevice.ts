import { Device, TemperatureSensor } from ".";
import { average } from "./helpers";

export class WeatherStation extends Device {
    actors: [];
    sensors: TemperatureSensor[];
    temperature: number;

    constructor() {
        super();
        this.sensors = [new TemperatureSensor()] as TemperatureSensor[];
        this.actors = [];
        this.temperature = NaN;
    }

    public async logic(): Promise<boolean> {
        this.temperature = average(this.sensors.map((sensor) => sensor.value));
        return true;
    }
}
