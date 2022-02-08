import { InfluxDB, Point } from "@influxdata/influxdb-client";
import * as mqtt from "mqtt";
import {
    AuthorizationsAPI,
    SetupAPI,
    SigninAPI,
} from "@influxdata/influxdb-client-apis";
import {
    WeatherStationInformationSent,
    StreetLampInformationSent,
} from "thing";

const InfluxURL = process.env.RUNNING_IN_CONTAINER
    ? "http://influxdb:8086"
    : "http://localhost:8086";

const MQTTurl = process.env.RUNNING_IN_CONTAINER
    ? "mqtt://mqtt"
    : "mqtt://localhost";

var token = undefined as string | undefined;
var InfluxClient = undefined as InfluxDB | undefined;

export async function setUp(
    username: string,
    password: string,
    org: string,
    bucket: string
) {
    const setupApi = new SetupAPI(new InfluxDB({ url: InfluxURL }));
    try {
        const res = await setupApi.postSetup({
            body: {
                org,
                bucket,
                username,
                password,
            },
        });
        console.log(`InfluxDB '${InfluxURL}' is now onboarded.`);
        token = res.auth?.token;
    } catch (err) {
        console.log("Onboarding failed, signing in instead.");
        const signinAPI = new SigninAPI(new InfluxDB({ url: InfluxURL }));
        const cookies = [] as (string | undefined)[];
        await signinAPI.postSignin(
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
        const authorizationAPI = new AuthorizationsAPI(
            new InfluxDB({ url: InfluxURL })
        );
        const authorizations = await authorizationAPI.getAuthorizations(
            {},
            session
        );
        if (authorizations.authorizations !== undefined) {
            token = authorizations.authorizations[0].token;
        }
    }
    InfluxClient = new InfluxDB({
        url: InfluxURL,
        token,
    });
    console.log("Got token and created InfluxDB client.");
    console.log("=".repeat(20), "InfluxDB Token", "=".repeat(20));
    console.log(token);
    console.log(
        "See https://docs.influxdata.com/influxdb/v2.0/tools/grafana/#configure-grafana-to-use-flux for information regarding connecting InfluxDB to Grafana"
    );
    console.log("=".repeat(56));

    const MQTTClient = mqtt.connect(MQTTurl);
    MQTTClient.on("connect", () => {
        console.log("Connected to MQTT broker.");
        MQTTClient.subscribe("things/data/#", { qos: 2 }, (err, granted) => {
            if (err) {
                console.error(err);
            } else {
                console.log(
                    "Subscribed to MQTT topic with QoS",
                    granted[0].qos
                );
            }
        });
        MQTTClient.on("message", (topic: string, msg: Buffer) => {
            const type = topic.split("/")[2];

            if (InfluxClient !== undefined) {
                const writeApi = InfluxClient.getWriteApi(org, bucket);
                writeApi.useDefaultTags({ host: "city1" });

                if (type === "weather_station") {
                    const data = JSON.parse(
                        msg.toString()
                    ) as WeatherStationInformationSent;
                    const point = new Point("weather_station")
                        .floatField("temperature", data.temperature)
                        .floatField("humidity", data.humidity)
                        .tag("id", data._id)
                        .tag("name", data.name);

                    writeApi.writePoint(point);
                } else if (type === "streetlamp") {
                    const data = JSON.parse(
                        msg.toString()
                    ) as StreetLampInformationSent;
                    const point = new Point("streetlight")
                        .booleanField("on", data.on)
                        .tag("id", data._id)
                        .tag("name", data.name);

                    writeApi.writePoint(point);
                } else {
                    console.log("unknown");
                }
            }
        });
    });
}
