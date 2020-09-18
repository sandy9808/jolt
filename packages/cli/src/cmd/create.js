/* imports */
import { ProjectGenerator } from "../modules/ProjectGenerator";
import { ComponentGenerator } from "../modules/ComponentGenerator";

/**
 * Creates a new project.
 * @param {Object} args - The cli arguments.
 * @private
 */
function create(args) {
    if(args.component || args.c) new ComponentGenerator(args._[1]).create();
    else new ProjectGenerator(args._[1]).create();
}

export default create;