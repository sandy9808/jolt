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
        const type = (args.type || args.t) ? validateType(args.type || args.t) : "application";
        const dest = (args.dest || args.d) ? args.dest || args.d : ".";

        new ProjectGenerator(name, type, dest).create();

    } else {
        console.error("Missing project name! (Example: jolt create my-app)");
    }
}

/**
 * Validate the project type
 * @param {string} type 
 * @private
 */
function validateType(type) {
    if (["application", "library"].includes(type)) return type;
    else return "application";
}

export default create;