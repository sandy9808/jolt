/* imports */
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { dependencies } from "./package.json";
import { builtinModules } from "module";

/* build config */
export default {
    input: "src/index.js",
    output: { file: "dist/toolchain.js", format: "cjs" },
    plugins: [
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            presets: [
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            "node": "10.6"
                        }
                    }
                ]
            ],
            plugins: ["@babel/plugin-proposal-class-properties"]
        }),
        resolve(),
        commonjs(),
        json(),
        terser({
            output: {
                preamble: "/* Copyright (c) 2020 Outwalk Studios */"
            }
        })
    ],
    external: Object.keys(dependencies).concat(builtinModules)
}