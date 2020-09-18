/* imports */
import { ComponentGenerator } from "../modules/ComponentGenerator";

/**
 * Generates a new component.
 * @param {Object} args - The cli arguments.
 * @private
 */
function generate(args) {
    const type = (args.class || args.c) ? "class" : "function";
    const dest = (args.dest || args.d) ? args.dest || args.d : "src/components";
    new ComponentGenerator(args._[1], type, dest).create();
}

export default generate;