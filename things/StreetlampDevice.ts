import { Device, PresenceSensor, LightActor } from ".";

export class StreetLamp extends Device {
    actors: LightActor[];
    sensors: PresenceSensor[];

    constructor() {
        super();
        this.sensors = [new PresenceSensor()] as PresenceSensor[];
        this.actors = [new LightActor()] as LightActor[];
    }

    public async logic(): Promise<boolean> {
        const presences = this.sensors.map((sensor) => sensor.value);
        const unique = new Set(presences);
        if (unique.has(true)) {
            await Promise.all(this.actors.map((actor) => actor.turnOn()));
            console.log("1");
        } else {
            for (const actor of this.actors) {
                const awaiting = [];
                if (actor.on === true) {
                    awaiting.push(actor);
                }
                await Promise.all(awaiting.map((actor) => actor.turnOff()));
            }
            console.log(2);
        }
        return true;
    }
}
