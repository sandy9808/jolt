/* imports */
import { Config } from "../utils/Config";
import { Parser } from "../utils/Parser";
import { ComponentGenerator } from "../modules/ComponentGenerator";

/**
 * Generates a new component.
 * @param {Object} args - The cli arguments.
 * @private
 */
function generate(args) {
    try {
        const config = Config.loadConfig();

        /* check if the config exists */
        if (!config) {
            console.error("The generate command can only be run inside a jolt workspace.");
            return;
        }

        /* validate the config ensuring it has all required properties to run */
        if (Config.validate(config)) {

            const name = Parser.exists(args._[1]);

            /* if a name is provided, generate the component */
            if (name) {

                /* get the options that are used for generating a project */
                const type = (args.class || args.c) ? "class" : (args.function || args.f) ? "function" : "class";
                const dest = (args.dest || args.d) ? args.dest || args.d : "src/components";

                new ComponentGenerator(name, type, dest).create();

            } else {
                console.error("Missing component name! (Example: jolt gen hello-world)");
            }
            
        } else {
            console.error(`Validation failed on "jolt.json", please run "jolt repair" to fix your config.`);
        }

    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Validate the component type
 * @param {string} type 
 * @private
 */
function validateType(type) {
    if (type == "class" || type == "function") return type;
    else return "function";
}

export default generate;