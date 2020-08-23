/* imports */
import { Config } from "../utils/Config";

/**
 * Runs the project on a live reloading development server.
 * @param {Object} args - The cli arguments.
 * @private
 */
async function serve(args) {
    try {
        const config = Config.loadConfig();

        if(!config) {
            console.error("The serve command can only be run inside a jolt workspace.");
            return;
        }

        const toolchain = await Config.loadToolchain(config);

        if(!toolchain) {
            console.error(`Unable to find the toolchain specified in jolt.json`);
            return;
        }

        if(!toolchain.serve) {
            console.error(`Toolchain does not expose a "serve" function.`);
            return;
        }

        toolchain.serve(Object.assign(config, args));

    } catch (error) {
        console.error(error.message);
    }
}

export default serve;