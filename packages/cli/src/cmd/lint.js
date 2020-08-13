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

        const toolchain = await Config.loadToolchain(config);

        if (!toolchain) {
            console.error(`Unable to find "toolchain" in jolt.json`);
            return;
        }

        if(!toolchain.lint) {
            console.error(`Toolchain does not expose a "lint" function.`);
            return;
        }

        toolchain.lint(Object.assign(config, args));

    } catch (error) {
        console.error(error.message);
    }
}

export default lint;