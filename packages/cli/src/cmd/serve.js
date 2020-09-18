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

        if (!config) {
            console.error("The serve command can only be run inside a jolt workspace.");
            return;
        }

        if (Config.validate(config)) {
            const toolchain = await Config.loadToolchain(config);

            if (!toolchain) {
                console.error(`Unable to find the toolchain specified in jolt.json`);
                return;
            }

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