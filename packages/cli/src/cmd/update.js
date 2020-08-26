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

        if(!config) {
            console.error(`The update command can only be run inside a jolt workspace.`);
            return;
        }

        if(!config.toolchain) {
            console.error(`Unable to find "toolchain" in jolt.json`);
            return;
        }
        try {
            await updateConfig(config);
            await updateToolchain(config.toolchain);

            console.log("Successfully updated your project.");
        } catch {
            console.log("Failed to update your project.");
        }
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Compares the project config with the template config to see what fields need to be added.
 * @param {Object} config - The project config.
 * @return {Promise}
 */
function updateConfig(config) {
    return new Promise((resolve, reject) => {

        try {
            const templateConfig = File.loadJSON(path.join(__dirname, "../template/jolt.json"));
            const templateKeys = Object.keys(templateConfig);

            for(let field of templateKeys) {
                if(config[field] == undefined) {
                    config[field] = templateConfig[field];
                }
            }

            resolve();
        } catch {
            reject();
        }
    });
}

/**
 * Runs npm update on the installed toolchain.
 * @param {string} toolchain - The toolchain to update.
 * @return {Promise}
 */
function updateToolchain(toolchain) {
    return new Promise((resolve, reject) => {
        const thread = exec(`npm update ${toolchain} @jolt/cli`, { cwd: process.cwd() }, (error) => {
            if(error) console.error(error.message);
        });

        thread.on("close", (code) => {
            if(code == 0) resolve();
            else reject();
        });
    });
}

export default update;