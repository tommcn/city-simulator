import { v4 as uuidv4 } from "uuid";
import * as mqtt from "mqtt";
import {
    WeatherStationInformationSent,
    StreetLampInformationSent,
    WeatherStationSensors,
    StreetLampSensors,
    InformationSent,
} from "thing";

const MQTTurl = process.env.RUNNING_IN_CONTAINER
    ? "mqtt://mqtt"
    : "mqtt://localhost";

export abstract class Thing {
    _id: string;
    name: string;

    constructor(name: string) {
        this.name = name;
        this._id = uuidv4();
    }

    public abstract tick(): Promise<boolean>;
}

export abstract class Sensor extends Thing {
    constructor(name: string) {
        super(name);
    }

    public abstract get value(): number | boolean;
}

export abstract class Actor extends Thing {
    constructor(name: string) {
        super(name);
    }
}

export abstract class Device extends Thing {
    type: string | undefined;
    actors: Actor[];
    sensors: StreetLampSensors | WeatherStationSensors;
    client: mqtt.Client;

    constructor(name: string) {
        super(name);
        this.actors = [];
        this.sensors = undefined;
        const client = mqtt.connect(MQTTurl);
        this.client = client;
    }

    public abstract getDataToSend(): object;

    private async send() {
        const data = this.getDataToSend() as InformationSent;
        data._id = this._id;
        data.name = this.name;
        this.client.publish(
            `things/data/${this.type}/${this._id}`,
            JSON.stringify(data)
        );
    }

    public async tick(): Promise<boolean> {
        const things = [
            ...Object.values(this.sensors).reduce(
                (acc, val) => acc.concat(val),
                []
            ),
            ...this.actors,
        ];
        const successes = await Promise.all(
            things.map((thing) => thing.tick())
        );
        const unique = new Set(successes);

        await this.logic();
        await this.send();

        return !unique.has(false);
    }

    public abstract logic(): Promise<any>;
}
