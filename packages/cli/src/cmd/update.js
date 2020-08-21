/* imports */
import { Config } from "../utils/Config";
import { exec } from "child_process";

/**
 * Updates the project toolchain.
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

        await updateToolchain(config.toolchain);
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Runs npm update on the installed toolchain.
 * @param {string} toolchain - The toolchain to update.
 * @return {Promise}
 */
function updateToolchain(toolchain) {
    return new Promise((resolve) => {
        const thread = exec(`npm update ${toolchain} @jolt/cli`, { cwd: process.cwd() }, (error) => {
            if(error) console.error(error.message);
        });

        thread.on("close", (code) => {
            if(code == 0) {
                console.log("Successfully updated your toolchain.");
                resolve();
            } else {
                console.log("Failed to update your toolchain.");
                resolve();
            }
        });
    });
}

export default update;