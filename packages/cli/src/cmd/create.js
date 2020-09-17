/* imports */
import { ProjectGenerator } from "../modules/ProjectGenerator";

/**
 * Creates a new project.
 * @param {Object} args - The cli arguments.
 * @private
 */
function create(args) {
    new ProjectGenerator(args._[1]).create();
}

export default create;