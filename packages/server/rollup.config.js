/* imports */
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { builtinModules } from "module";

/* build config */
export default [
    {
        input: "src/cli.js",
        output: { file: "dist/cli.js", format: "cjs" },
        plugins: [
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
            terser({
                output: {
                    preamble: "/* Copyright (c) 2020 Outwalk Studios */"
                }
            })
        ],
        external: builtinModules
    }
]