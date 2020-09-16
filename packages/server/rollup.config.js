/* imports */
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { builtinModules } from "module";

export default [
    {
        input: "src/cli.js",
        output: { file: "dist/cli.js", format: "cjs" },
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
            json(),
            terser({
                output: {
                    preamble: "#!/usr/bin/env node"
                }
            })
        ],
        external: builtinModules
    },
    {
        input: "src/api.js",
        output: [
            { file: "dist/api.cjs.js", format: "cjs", exports: "default" },
            { file: "dist/api.esm.js", format: "esm", exports: "default" }
        ],
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
            terser({
                output: {
                    preamble: "/* Copyright (c) 2020 Outwalk Studios */"
                }
            })
        ],
        external: builtinModules
    }
]