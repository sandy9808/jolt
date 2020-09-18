/* imports */
import { File } from "./File";
import path from "path";
import fs from "fs";

/**
 * Config Utilities
 * @class
 */
export class Config {

    static _defaults = {
        targets: "> 1.5%, not dead",
        sourcemaps: false,
        minify: true,
        preamble: ""
    };

    /**
     * Loads the config from jolt.json
     * @return {Object}
     */
    static loadConfig() {
        try {
            return Object.assign(Config._defaults, File.readJSON(path.join(process.cwd(), "jolt.json")));
        } catch {
            return null;
        }
    }

    /**
    * Loads the config from jolt.json without defaults
    * @return {Object}
    */
    static loadRawConfig() {
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
            const templateConfig = File.readJSON(path.join(__dirname, "../templates/project/jolt.json"));
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