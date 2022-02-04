import { readFile } from "fs/promises";
import YAML from "yaml";

export async function initDevices() {
    const config = YAML.parse(await readFile("./devices.yml", "utf8"));
    console.log(config);
}
