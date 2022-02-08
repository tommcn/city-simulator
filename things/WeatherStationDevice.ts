import { Device } from ".";
import { HumiditySensor, TemperatureSensor } from "./sensors";
import { average } from "./helpers";
import { WeatherStationData, WeatherStationSensors } from "thing";

export class WeatherStation extends Device {
    actors: [];
    sensors: WeatherStationSensors;
    temperature: number;
    humidity: number;

    constructor(name: string) {
        super(name);
        this.sensors = {
            temperature: [new TemperatureSensor("ts-1")],
            humidity: [new HumiditySensor("hs-1")],
        };
        this.actors = [];
        this.temperature = NaN;
        this.type = "weather_station";
    }

    public async logic(): Promise<boolean> {
        this.temperature = average(
            this.sensors.temperature.map((sensor) => sensor.value)
        );
        this.humidity = average(
            this.sensors.humidity.map((sensor) => sensor.value)
        );
        return true;
    }
    public getDataToSend(): WeatherStationData {
        return {
            temperature: this.temperature,
            humidity: this.humidity,
            numSensors: Object.keys(this.sensors).flat().length,
        };
    }
}
