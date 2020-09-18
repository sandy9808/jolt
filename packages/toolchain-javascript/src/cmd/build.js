/* imports */
import rollup from "rollup";
import getRollupConfig from "../configs/rollupConfig.js";

/**
 * Builds the project.
 * @param {Object} options
 */
async function build(options) {

    const config = getRollupConfig(options);

    try {
        const bundle = await rollup.rollup(config.input);
        await bundle.write(config.output);
        console.log(`${options.main} -> ${options.dest}`);
    } catch (error) {
        console.error(`\nJolt StackTrace: ${error.message}`);
        if (error.loc) {
            console.error(`File: ${error.id}`);
            console.error(`Line: ${error.loc.line}, Column: ${error.loc.column}`);
            if (error.frame) { console.warn(error.frame); }
        }
    }
}

export default build;