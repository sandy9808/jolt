/* imports */
import { Config } from "../utils/Config";
import { File } from "../utils/File";
import path from "path";

/**
 * Repairs the config file.
 * @private
 */
async function repair() {
    try {
        const config = Config.loadConfig();

        /* check if the config exists */
        if (!config) {
            console.error("The repair command can only be run inside a jolt workspace.");
            return;
        }

        try {
            const defaultConfig = {
                main: "src/app.js",
                dest: "public",
                toolchain: "@jolt/toolchain-javascript"
            };

            const requiredKeys = Object.keys(defaultConfig);

            /* compare the config with the default config and add any missing required properties */
            for (let field of requiredKeys) {
                if (config[field] == undefined) config[field] = defaultConfig[field];
            }

            File.writeJSON(path.join(process.cwd(), "jolt.json"), config);

            console.log("Successfully repaired your project config.");

        } catch {
            console.log("Failed to repair your project config.");
        }
    } catch (error) {
        console.error(error.message);
    }
}

export default repair;