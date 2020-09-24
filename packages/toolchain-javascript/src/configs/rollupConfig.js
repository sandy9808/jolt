/* imports */
import minifyTemplate from "rollup-plugin-html-literals";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import folder from "rollup-plugin-import-folder";
import alias from "@rollup/plugin-alias";
import url from "@rollup/plugin-url";
import css from "rollup-plugin-import-css";
import { terser } from "rollup-plugin-terser";
import path from "path";

function getRollupConfig(options) {

    /* setup rollup plugins */
    const plugins = [

        /* minify html tagged template literals */
        minifyTemplate({
            options: {
                minifyOptions: {
                    keepClosingSlash: true
                }
            }
        }),

        /* transpile code */
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
            plugins: ["@babel/plugin-proposal-class-properties"],
            sourceMaps: options.sourcemap
        }),

        /* resolve node modules */
        resolve(),

        /* import commonjs as es modules */
        commonjs(),

        /* import components by the folder name */
        folder(),

        /* map aliases to file paths */
        alias({
            entries: getMappings(options)
        }),

        /* import assets */
        url({
            limit: 0,
            publicPath: "./assets/",
            destDir: "./public/assets",
            include: [
                "**/*.svg",
                "**/*.png",
                "**/*.jpg",
                "**/*.jpeg",
                "**/*.gif"
            ]
        }),

        /* import css */
        css({
            output: `${options.dest}/bundle.css`,
            minify: options.minify
        }),

        /* minify code */
        terser({
            output: {
                preamble: options.preamble
            }
        })
    ];

    const input = {
        input: options.main,
        plugins: plugins
    };

    const output = {
        file: `${options.dest}/bundle.js`,
        format: "iife",
        sourcemap: options.sourcemap
    };

    return { in: input, out: output };
}

function getMappings(options) {
    const keys = Object.keys(options.mappings);
    const mappings = [];

    for (let key of keys) {
        mappings.push({
            find: key,
            replacement: path.resolve(path.resolve(process.cwd()), options.mappings[key])
        });
    }

    return mappings;
}

export default getRollupConfig;