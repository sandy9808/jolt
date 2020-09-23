/* imports */
import { Config } from "../utils/Config";

/**
 * Lints the jolt project.
 * @param {Object} args
 * @private
 */
async function lint(args) {
    try {
        const config = Config.loadConfig();

        /* check if the config exists */
        if (!config) {
            console.error("The lint command can only be run inside a jolt workspace.");
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

            /* validate the toolchain */
            if(!Config.validateToolchain(toolchain)) return;

            toolchain.lint(Object.assign(toolchain.defaultConfig, config, args));

        } else {
            console.error(`Validation failed on "jolt.json", please run "jolt repair" to fix your config.`);
        }

    } catch (error) {
        console.error(error.message);
    }
}

export default lint;