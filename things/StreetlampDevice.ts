import { Device, LightActor } from ".";
import { PresenceSensor } from "./sensors";
interface StreetLampData {
    on: boolean;
    numSensors: number;
    numLights: number;
}

export class StreetLamp extends Device {
    actors: LightActor[];
    sensors: PresenceSensor[];
    on: boolean;

    constructor(name: string) {
        super(name);
        this.sensors = [new PresenceSensor(`${name}-ps`)] as PresenceSensor[];
        this.actors = [new LightActor(`${name}-la`)] as LightActor[];
        this.on = false;
        this.type = "streetlamp";
    }

    public async logic(): Promise<boolean> {
        const presences = this.sensors.map((sensor) => sensor.value);
        const unique = new Set(presences);
        if (unique.has(true)) {
            await Promise.all(this.actors.map((actor) => actor.turnOn()));
            this.on = true;
        } else {
            for (const actor of this.actors) {
                const awaiting = [];
                if (actor.on === true) {
                    awaiting.push(actor);
                }
                await Promise.all(awaiting.map((actor) => actor.turnOff()));
                this.on = false;
            }
        }
        return true;
    }
    public getDataToSend(): StreetLampData {
        return {
            on: this.on,
            numSensors: this.sensors.length,
            numLights: this.actors.length,
        };
    }
}
