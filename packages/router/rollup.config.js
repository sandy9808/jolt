/* imports */
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

/* build config */
export default {
    input: "src/index.js",
    output: [
        { file: "dist/router.esm.js", format: "esm" },
        { file: "dist/router.cjs.js", format: "cjs" },
        {
            file: "dist/router.umd.js",
            format: "umd",
            name: "Router",
            globals: { "jolt": "Jolt" }
        }
    ],
    plugins: [
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            presets: [
                [
                    "@babel/preset-env",
                    {
                        "targets": "> 1.5%, not dead"
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
    external: ["jolt"]

}