/* imports */
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
        terser({
            output: {
                preamble: "/* Copyright (c) 2020 Outwalk Studios */"
            }
        })
    ],
    external: ["jolt"]

}