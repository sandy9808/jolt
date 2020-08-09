/**
 * Help menu mapping
 * @type {Object}
 * @private
 */
const helpMap = {
    main: `
    Usage: jolt [command] <options>

    Options: 
        -v, --version,
        -h, --help

    Commands:
        create <app-name> ........ Creates a new project.
    `,

    create: `
    Usage: jolt create <app-name>

    - Creates a new project.
    `,
};

/**
 * Prints the help menu associated with the command.
 * @param {Object} args - The cli arguments.
 * @private
 */
function help(args) {
    const subCmd = args._[0] == "help" ? args._[1] : args._[0];
    console.log(helpMap[subCmd] || helpMap.main);
}

export default help;