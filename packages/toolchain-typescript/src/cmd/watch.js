/* imports */
import rollup from "rollup";
import getRollupConfig from "../configs/rollupConfig.js";

/**
 * Builds the project when a file is saved.
 * @param {Object} options 
 */
async function watch(options) {

    const config = getRollupConfig(options);

    const watchConfig = {
        input: config.in.input,
        output: config.out,
        plugins: config.in.plugins,
        watch: {
            exclude: ["node_modules/**"]
        }
    };

    watchConfig.onwarn = function (warning) {
        console.warn(`Jolt Warning: ${warning.message}`);
        console.log(warning);
        if (warning.loc) {
            console.warn(`File: ${warning.id}`);
            console.warn(`Line: ${warning.loc.line}, Column: ${warning.loc.column}`);
            if (warning.frame) { console.warn(warning.frame); }
        }
    };

    const watcher = rollup.watch(watchConfig);

    watcher.on("event", (event) => {
        switch (event.code) {
            case "BUNDLE_END":
                console.log(`${options.main} -> ${options.dest}`);
                break;
            case "ERROR":
                console.error(`\nJolt StackTrace: ${event.error.message}`);
                if (event.error.loc) {
                    console.error(`File: ${event.error.id}`);
                    console.error(`Line: ${event.error.loc.line}, Column: ${event.error.loc.column}`);
                    if (event.error.frame) { console.warn(event.error.frame); }
                }
                break;
            case "FATAL":
                console.error("Fatal Error Occurred!");
                process.exit(1);
        }
    });
}

export default watch;