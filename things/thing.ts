import { v4 as uuidv4 } from "uuid";

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
    actors: Actor[];
    sensors: Sensor[];

    constructor(name: string) {
        super(name);
        this.actors = [];
        this.sensors = [];
    }

    public async tick(): Promise<boolean> {
        const things = [...this.sensors, ...this.actors];
        const successes = await Promise.all(
            things.map((thing) => thing.tick())
        );
        const unique = new Set(successes);

        await this.logic();

        return !unique.has(false);
    }

    public abstract logic(): Promise<any>;
}
