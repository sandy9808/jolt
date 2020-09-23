/* imports */
import minifyTemplate from "rollup-plugin-html-literals";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import folder from "rollup-plugin-import-folder";
import url from "@rollup/plugin-url";
import css from "rollup-plugin-import-css";
import includepaths from "rollup-plugin-includepaths";
import { terser } from "rollup-plugin-terser";
import typescriptConfig from "./typescriptConfig.json";

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
        typescript({
            tsconfigDefaults: typescriptConfig
        }),

        /* resolve node modules */
        resolve(),

        /* import commonjs as es modules */
        commonjs(),

        /* import components by the folder name */
        folder(),

        /* map aliases to file paths */
        includepaths({
            include: options.mappings
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

export default getRollupConfig;