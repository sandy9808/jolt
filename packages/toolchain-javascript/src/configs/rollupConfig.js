/* imports */
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import css from "rollup-plugin-import-css";
import minifyTemplate from "rollup-plugin-html-literals";
import { terser } from "rollup-plugin-terser";

function getRollupConfig(options) {

    /* setup rollup plugins */
    const plugins = [
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
            output: `${options.dest}/bundle.css`,
            minify: options.minify
        })
    ];

    if (options.minify) {
        plugins.unshift(
            minifyTemplate({
                options: {
                    minifyOptions: {
                        keepClosingSlash: true
                    }
                }
            })
        );

        plugins.push(
            terser({
                output: {
                    preamble: options.preamble
                }
            })
        );
    }

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