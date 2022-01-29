import { v4 as uuidv4 } from "uuid";

export abstract class Thing {
    protected _id: string;
    constructor() {
        this._id = uuidv4();
    }

    public abstract tick(): Promise<boolean>;
}

export abstract class Sensor extends Thing {
    constructor() {
        super();
    }

    public abstract get value(): number;
}

export abstract class Actor extends Thing {
    constructor() {
        super();
    }
}
