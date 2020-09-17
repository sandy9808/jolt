/* imports */
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { builtinModules } from "module";

/* build config */
export default {
    input: "src/index.js",
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
}