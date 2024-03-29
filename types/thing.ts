import {
    HumiditySensor,
    PresenceSensor,
    TemperatureSensor,
} from "../things/sensors";

export interface DeviceData {
    _id: string;
    name: string;
}

export interface WeatherStationSensors {
    temperature: TemperatureSensor[];
    humidity: HumiditySensor[];
}

export interface StreetLampSensors {
    presence: PresenceSensor[];
}
export interface WeatherStationData {
    temperature: number;
    humidity: number;
    numSensors: number;
}

export interface WeatherStationInformationSent
    extends WeatherStationData,
        DeviceData {}

export interface StreetLampData {
    on: boolean;
    numSensors: number;
    numLights: number;
}

export interface StreetLampInformationSent extends StreetLampData, DeviceData {}

export type InformationSent =
    | WeatherStationInformationSent
    | StreetLampInformationSent;

export type Sensors = WeatherStationSensors | StreetLampSensors;
