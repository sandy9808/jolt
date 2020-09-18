/**
 * Help menu mapping
 * @type {Object}
 * @private
 */
const helpMap = {
    main: `
    Usage: jolt [command] <options>
    Options: 
        -v, --version ........ Logs the version of the cli.
        -h, --help ........ Logs the help menu.
    Commands:
        create [app-name] <options> ........ Creates a new project.
        build <options> ........ Builds the project.
        watch <options> ........ Builds the project whenever a file is saved.
        lint <options> ........ Lints the project codebase.
        serve <options> ........ Runs the project on a development server.
        update ........ Updates the project's config, toolchain and CLI.
        repair ........ Repairs the project's config file.
    `,

    create: `
    Usage: jolt create [app-name] <options>
    - Creates a new project.
    `,

    build: `
    Usage: jolt build <options>
    - Builds the project.
    `,

    watch: `
    Usage: jolt watch <options>
    - Builds the project whenever a file is saved.
    `,

    lint: `
    Usage: jolt lint <options>
    - Lints the project codebase.
    `,

    serve: `
    Usage: jolt serve <options>
    - Runs the project on a development server.
    `,

    update: `
    Usage: jolt update
    - Updates the project's config, toolchain, and CLI.
    `,

    repair: `
    Usage: jolt repair
    - Repairs the project's config file.
    `
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