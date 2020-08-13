/* imports */
import { Config } from "../utils/Config";

/**
 * Builds the jolt project.
 * @param {Object} args - The cli arguments.
 * @private
 */
async function build(args) {
    try {
        const config = Config.loadConfig();

        if (!config) {
            console.error("The build command can only be run inside a jolt workspace.");
            return;
        }

        const toolchain = await Config.loadToolchain(config);

        if (!toolchain) {
            console.error(`Unable to find "toolchain" in jolt.json`);
            return;
        }

        if(!toolchain.build) {
            console.error(`Toolchain does not expose a "build" function.`);
            return;
        }

        toolchain.build(Object.assign(config, args));
        
    } catch (error) {
        console.error(error.message);
    }
}

export default build;