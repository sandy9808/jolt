/* imports */
import { rollup } from "rollup";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import css from "rollup-plugin-css-bundle";
import minifyTemplate from "rollup-plugin-html-literals";
import { terser } from "rollup-plugin-terser";

/**
 * Builds the project.
 * @param {Object} options 
 */
async function build(options) {

    const input = {
        input: options.main,
        plugins: [
            typescript(),
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
    };

    const output = {
        file: `${options.dest}/bundle.js`,
        format: "iife",
        sourcemap: options.sourcemap
    };

    try {
        const bundle = await rollup(input);
        await bundle.write(output);
        console.log(`${options.main} -> ${options.dest}`);
    } catch (error) {
        console.error(`\nJolt StackTrace: ${error.message}`);
        if (error.loc) {
            console.error(`File: ${error.id}`);
            console.error(`Line: ${error.loc.line}, Column: ${error.loc.column}`);
            if (error.frame) { console.warn(error.frame); }
        }
    }

}

export default build;