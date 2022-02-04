import { StreetLamp } from "../things";
import { WeatherStation } from "../things";

export interface Devices {
    sls: StreetLamp[];
    wss: WeatherStation[];
}
