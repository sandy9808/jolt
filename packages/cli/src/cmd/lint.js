/* imports */
import { Config } from "../utils/Config";

/**
 * Lints the jolt project.
 * @param {Object} args - The cli arguments.
 * @private
 */
async function lint(args) {
    try {
        const config = Config.loadConfig();

        if (!config) {
            console.error("The lint command can only be run inside a jolt workspace.");
            return;
        }

        if (Config.validateConfig(config)) {
            const toolchain = await Config.loadToolchain(config);

            if (!toolchain) {
                console.error(`Unable to find the toolchain specified in jolt.json`);
                return;
            }

            if (!toolchain.lint) {
                console.error(`Toolchain does not expose a "lint" function.`);
                return;
            }

            toolchain.lint(Object.assign(config, args));
            
        } else {
            console.error(`Failed to validate "jolt.json", please run "jolt update" to fix your config.`);
        }

    } catch (error) {
        console.error(error.message);
    }
}

export default lint;