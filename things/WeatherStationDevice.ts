import { Device, TemperatureSensor } from ".";
import { average } from "./helpers";

interface WeatherStationData {
    temperature: number;
    numSensors: number;
}

export class WeatherStation extends Device {
    actors: [];
    sensors: TemperatureSensor[];
    temperature: number;

    constructor(name: string) {
        super(name);
        this.sensors = [new TemperatureSensor("ts-1")] as TemperatureSensor[];
        this.actors = [];
        this.temperature = NaN;
        this.type = "weather_station";
    }

    public async logic(): Promise<boolean> {
        this.temperature = average(this.sensors.map((sensor) => sensor.value));
        return true;
    }
    public getDataToSend(): WeatherStationData {
        return {
            temperature: this.temperature,
            numSensors: this.sensors.length,
        };
    }
}
