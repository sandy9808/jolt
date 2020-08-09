/* imports */
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { builtinModules } from "module";

/* build config */
export default {
    input: "src/index.js",
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
}