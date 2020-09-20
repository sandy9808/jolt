/* imports */
import { Config } from "../utils/Config";

/**
 * Runs the project on a live reloading development server.
 * @param {Object} args
 * @private
 */
async function serve(args) {
    try {
        const config = Config.loadConfig();

        /* check if the config exists */
        if (!config) {
            console.error("The serve command can only be run inside a jolt workspace.");
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

            /* check if a serve function is exposed on the toolchain */
            if (!toolchain.serve) {
                console.error(`The toolchain does not expose a "serve" function.`);
                return;
            }

            toolchain.serve(Object.assign(config, args));

        } else {
            console.error(`Validation failed on "jolt.json", please run "jolt repair" to fix your config.`);
        }

    } catch (error) {
        console.error(error.message);
    }
}

export default serve;