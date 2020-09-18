/* imports */
import { Config } from "../utils/Config";

/**
 * Builds the jolt project.
 * @param {Object} args
 * @private
 */
async function build(args) {
    try {
        const config = Config.loadConfig();

        if (!config) {
            console.error("The build command can only be run inside a jolt workspace.");
            return;
        }

        if (Config.validate(config)) {
            const toolchain = await Config.loadToolchain(config);

            if (!toolchain) {
                console.error(`Unable to find the toolchain specified in jolt.json`);
                return;
            }

            if (!toolchain.build) {
                console.error(`The toolchain does not expose a "build" function.`);
                return;
            }

            toolchain.build(Object.assign(config, args));

        } else {
            console.error(`Validation failed on "jolt.json", please run "jolt repair" to fix your config.`);
        }

    } catch (error) {
        console.error(error.message);
    }
}

export default build;