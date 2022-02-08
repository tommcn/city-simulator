import { StreetLampData, StreetLampSensors } from "thing";
import { Device, LightActor } from ".";
import { PresenceSensor } from "./sensors";

export class StreetLamp extends Device {
    actors: LightActor[];
    sensors: StreetLampSensors;
    on: boolean;

    constructor(name: string) {
        super(name);
        this.sensors = { presence: [new PresenceSensor(`${name}-ps`)] };
        this.actors = [new LightActor(`${name}-la`)] as LightActor[];
        this.on = false;
        this.type = "streetlamp";
    }

    public async logic(): Promise<boolean> {
        const presences = this.sensors.presence.map((sensor) => sensor.value);
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
            numSensors: Object.keys(this.sensors).flat().length,
            numLights: this.actors.length,
        };
    }
}
