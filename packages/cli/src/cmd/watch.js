/* imports */
import { Config } from "../utils/Config";

/**
 * Builds the jolt project whenever a file is saved.
 * @param {Object} args - The cli arguments.
 * @private
 */
async function watch(args) {
    try {
        const config = Config.loadConfig();

        if (!config) {
            console.error("The watch command can only be run inside a jolt workspace.");
            return;
        }

        const toolchain = await Config.loadToolchain(config);

        if (!toolchain) {
            console.error(`Unable to find the toolchain specified in jolt.json`);
            return;
        }

        if(!toolchain.watch) {
            console.error(`Toolchain does not expose a "watch" function.`);
            return;
        }

        toolchain.watch(Object.assign(config, args));
        
    } catch (error) {
        console.error(error.message);
    }
}

export default watch;