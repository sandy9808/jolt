/* imports */
import { Config } from "../utils/Config";
import { File } from "../utils/File";
import { exec } from "child_process";
import path from "path";

/**
 * Updates the project.
 * @private
 */
async function update() {
    try {
        const config = Config.loadConfig();

        if (!config) {
            console.error("The update command can only be run inside a jolt workspace.");
            return;
        }

        if (!config.toolchain) {
            console.error(`Unable to find "toolchain" in jolt.json`);
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

            await updateDevDependencies(config);
            console.log("Successfully updated your project.");
        } catch {
            console.log("Failed to update your project.");
        }

    } catch (error) {
        console.error(error.message);
    }
}

function updateDevDependencies(config) {
    const isFile = File.isFilePath(config.toolchain);
    const toolchain = isFile ? "" : config.toolchain;

    return new Promise((resolve, reject) => {
        const thread = exec(`npm update @jolt/cli ${toolchain}`, { cwd: process.cwd() }, (error) => {
            if (error) console.error(error.message);
        });

        thread.on("close", (code) => {
            if (code == 0) resolve();
            else reject();
        });
    });
}

export default update;