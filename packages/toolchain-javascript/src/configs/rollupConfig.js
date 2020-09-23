/* imports */
import minifyTemplate from "rollup-plugin-html-literals";
import css from "rollup-plugin-import-css";
import folder from "rollup-plugin-import-folder";
import url from "@rollup/plugin-url";
import includepaths from "rollup-plugin-includepaths";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

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

        /* import css */
        css({
            output: `${options.dest}/bundle.css`,
            minify: options.minify
        }),

        /* import components by the folder name */
        folder(),

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

        /* map aliases to file paths */
        includepaths({
            include: options.mappings
        }),

        /* resolve node modules */
        resolve(),

        /* import commonjs as es modules */
        commonjs(),

        /* import json as es modules */
        json(),

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

        /* minify code */
        terser({
            output: {
                preamble: options.preamble
            },
            minify: {
                sourceMap: options.sourcemap
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

export default getRollupConfig;