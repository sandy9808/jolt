/* imports */
import rollup from "rollup";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import css from "rollup-plugin-css-bundle";
import minifyTemplate from "rollup-plugin-html-literals";
import { terser } from "rollup-plugin-terser";

/**
 * Builds the project when a file is saved.
 * @param {Object} options 
 */
async function watch(options) {

    const config = {
        in: {
            input: options.main,
            plugins: [
                babel({
                    babelHelpers: "bundled",
                    exclude: "node_modules/**",
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                "targets": options.targets
                            }
                        ]
                    ],
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }),
                resolve(),
                commonjs(),
                url({
                    limit: 0,
                    publicPath: "./assets/",
                    destDir: `./${options.dest}/assets`,
                    include: [
                        "**/*.svg",
                        "**/*.png",
                        "**/*.jpg",
                        "**/*.jpeg",
                        "**/*.gif"
                    ]
                }),
                css({
                    output: `${options.dest}/bundle.css`
                }),
                minifyTemplate({
                    options: {
                        minifyOptions: {
                            keepClosingSlash: true
                        }
                    }
                }),
                terser(),
            ]
        },
        out: {
            file: `${options.dest}/bundle.js`,
            format: "iife"
        }
    };

    const watchOptions = {
        input: config.in.input,
        output: config.out,
        plugins: config.in.plugins,
        watch: {
            exclude: ["node_modules/**"]
        }
    };

    watchOptions.onwarn = function (warning) {
        console.warn(`Jolt Warning: ${warning.message}`);
        console.log(warning);
        if (warning.loc) {
            console.warn(`File: ${warning.id}`);
            console.warn(`Line: ${warning.loc.line}, Column: ${warning.loc.column}`);
            if (warning.frame) { console.warn(warning.frame); }
        }
    };

    const watcher = rollup.watch(watchOptions);

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