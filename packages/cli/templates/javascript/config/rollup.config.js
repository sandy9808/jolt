/* imports */
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import css from "rollup-plugin-css-bundle";
import minifyTemplate from "rollup-plugin-minify-html-literals";
import { terser } from "rollup-plugin-terser";

/* build config */
export default {
    input: "src/app.js",
    output: {
        file: "public/bundle.js",
        format: "iife"
    },
    plugins: [
        /* allows importing modules by name from node_modules */
        resolve(),
        /* allows using commonjs modules as esm modules */
        commonjs(),
        /* allows importing assets in your source files */
        url({
            limit: 0,
            publicPath: "./assets/",
            destDir: "./public/assets",
            include: [
                "**/*.svg",
                "**/*.png",
                "**/*.jpg",
                "**/*.jpeg",
                "**/*.gif",
            ]
        }),

        /* allows importing css in yout source files to be extracted into bundle.css */
        css({
            output: "public/bundle.css"
        }),

        /* minifies jolt template literals */
        minifyTemplate(),

        /* minifies your bundled source code */
        terser()
    ]
}