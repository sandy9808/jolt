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
        const config = Config.loadRawConfig();

        if (!config) {
            console.error("The repair command can only be run inside a jolt workspace.");
            return;
        }

        try {
            const templateConfig = File.readJSON(path.join(__dirname, "../template/jolt.json"));
            const templateKeys = Object.keys(templateConfig);

            for (let field of templateKeys) {
                if (typeof config[field] !== typeof templateConfig[field]) {
                    config[field] = templateConfig[field];
                }
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