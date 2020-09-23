/* imports */
import { Parser } from "../utils/Parser";
import { ProjectGenerator } from "../modules/ProjectGenerator";

/**
 * Creates a new project.
 * @param {Object} args - The cli arguments.
 * @private
 */
function create(args) {
    const name = Parser.exists(args._[1]);

    /* if a name is provided, generate the project */
    if (name) {

        /* get the options that are used for generating a project */
        const toolchain = (args.toolchain || args.t) ? args.toolchain || args.t : "@jolt/toolchain-javascript@4.x.x"
        const dest = (args.dest || args.d) ? args.dest || args.d : ".";

        new ProjectGenerator(name, toolchain, dest).create();

    } else {
        console.error("Missing project name! (Example: jolt create my-app)");
    }
}

export default create;