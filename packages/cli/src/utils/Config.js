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
     * Validates that the required config fields exist.
     * @param {Object} config
     * @return {boolean}
     */
    static validate(config) {
        try {
            const templateConfig = File.readJSON(path.join(__dirname, "../template/jolt.json"));
            const templateKeys = Object.keys(templateConfig);

            for (let field of templateKeys) {
                if (typeof config[field] !== typeof templateConfig[field]) {
                    return false;
                }
            }

            return true;
        } catch {
            return false;
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