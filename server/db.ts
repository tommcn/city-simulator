import { InfluxDB, Point } from "@influxdata/influxdb-client";
import {
    AuthorizationsAPI,
    SetupAPI,
    SigninAPI,
} from "@influxdata/influxdb-client-apis";
import { Devices } from "./types";

// The token will change when initalizing the InfluxDB server in a new container
const org = "org";
const bucket = "bucket";
const url = process.env.RUNNING_IN_CONTAINER
    ? "http://influxdb:8086"
    : "http://localhost:8086";
var token = undefined as string | undefined;

var client = undefined as InfluxDB | undefined;

export async function setUp(
    username: string,
    password: string,
    org: string,
    bucket: string
) {
    const setupApi = new SetupAPI(new InfluxDB({ url }));
    try {
        const res = await setupApi.postSetup({
            body: {
                org,
                bucket,
                username,
                password,
            },
        });
        console.log(`InfluxDB '${url}' is now onboarded.`);
        token = res.auth?.token;
    } catch (err) {
        console.log("Onboarding failed, signing in instead.");
        const signinAPI = new SigninAPI(new InfluxDB({ url }));
        const cookies = [] as (string | undefined)[];
        const auths = await signinAPI.postSignin(
            {
                auth: { user: username, password },
            },
            {
                responseStarted: (headers, status) => {
                    if (status !== undefined) {
                        if (status < 300) {
                            const setCookie = headers["set-cookie"];
                            if (typeof setCookie === "string") {
                                cookies.push(setCookie.split(";").shift());
                            } else if (Array.isArray(setCookie)) {
                                setCookie.forEach((c) =>
                                    cookies.push(c.split(";").shift())
                                );
                            }
                        }
                    }
                },
            }
        );
        const session = { headers: { cookie: cookies.join("; ") } };
        const authorizationAPI = new AuthorizationsAPI(new InfluxDB({ url }));
        const authorizations = await authorizationAPI.getAuthorizations(
            {},
            session
        );
        if (authorizations.authorizations !== undefined) {
            token = authorizations.authorizations[0].token;
        }
    }
    client = new InfluxDB({
        url: url,
        token,
    });
    console.log("\nGot token and created InfluxDB client.");
    console.log("=".repeat(20), "InfluxDB Token", "=".repeat(20));
    console.log(token);
    console.log(
        "See https://docs.influxdata.com/influxdb/v2.0/tools/grafana/#configure-grafana-to-use-flux for information regarding connecting InfluxDB to Grafana"
    );
    console.log("=".repeat(56));
}

export async function saveDeviceState(devices: Devices) {
    if (client !== undefined) {
        const writeApi = client.getWriteApi(org, bucket);
        writeApi.useDefaultTags({ host: "city1" });

        for (const ws of devices.wss) {
            const point = new Point("weather_station")
                .floatField("temperature", ws.temperature)
                .tag("id", ws._id);

            writeApi.writePoint(point);
        }
        for (const sl of devices.sls) {
            const point = new Point("streetlight")
                .booleanField("on", sl.on)
                .tag("id", sl._id);
            writeApi.writePoint(point);
        }

        await writeApi.close();
    } else {
        console.log(
            "No client was authenticated, data was not sent to InfluxDB"
        );
    }
}
