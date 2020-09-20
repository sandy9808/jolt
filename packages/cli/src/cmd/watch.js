/* imports */
import { Config } from "../utils/Config";

/**
 * Builds the jolt project whenever a file is saved.
 * @param {Object} args
 * @private
 */
async function watch(args) {
    try {
        const config = Config.loadConfig();

        /* check if the config exists */
        if (!config) {
            console.error("The watch command can only be run inside a jolt workspace.");
            return;
        }

        /* validate the config ensuring it has all required properties to run */
        if (Config.validate(config)) {
            const toolchain = await Config.loadToolchain(config);

            /* check if the toolchain exists */
            if (!toolchain) {
                console.error(`Unable to find the toolchain specified in jolt.json`);
                return;
            }

            /* check if a watch function is exposed on the toolchain */
            if (!toolchain.watch) {
                console.error(`The toolchain does not expose a "watch" function.`);
                return;
            }

            toolchain.watch(Object.assign(config, args));

        } else {
            console.error(`Validation failed on "jolt.json", please run "jolt repair" to fix your config.`);
        }

    } catch (error) {
        console.error(error.message);
    }
}

export default watch;