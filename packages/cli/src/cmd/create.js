/* imports */
import { ProjectGenerator } from "../modules/ProjectGenerator";

/**
 * Creates a new project.
 * @param {Object} args - The cli arguments.
 * @private
 */
function create(args) {
    const dest = (args.dest || args.d) ? args.dest || args.d : ".";
    new ProjectGenerator(args._[1], dest).create();
}

export default create;