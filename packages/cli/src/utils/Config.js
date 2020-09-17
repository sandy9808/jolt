/* imports */
import { File } from "./File";
import path from "path";
import fs from "fs";

/**
 * Config Utilities
 * @class
 */
export class Config {

    /**
     * Loads the config from jolt.json
     * @return {Object}
     */
    static loadConfig() {
        try {
            return File.readJSON(path.join(process.cwd(), "jolt.json"));
        } catch {
            return null;
        }
    }

    /**
     * Loads the toolchain from the config.
     * @param {Object} config
     * @return {Object}
     */
    static loadToolchain(config) {
        const toolchain = File.isFilePath(config.toolchain) ? path.join(process.cwd(), config.toolchain) : config.toolchain;
        const toolchainPath = (path.isAbsolute(toolchain)) ? toolchain : path.join(process.cwd(), "node_modules", toolchain);

        if (config.toolchain && fs.existsSync(toolchainPath)) return import(require.resolve(toolchain, { paths: [process.cwd()] }));
        else return null;
    }
}