/* imports */
import { File } from "./File";
import path from "path";
import fs from "fs";

/**
 * Config Utils Class
 * @class
 */
export class Config {

    /**
     * Loads the config from jolt.json
     * @return {Object}
     */
    static loadConfig() {
        try {
            return File.loadJSON(path.join(process.cwd(), "jolt.json"));
        } catch {
            return null;
        }
    }

    /**
     * Validates that required config fields exist.
     * @param {Object} config
     * @return {boolean}
     */
    static validateConfig(config) {
        try {
            const templateConfig = File.loadJSON(path.join(__dirname, "../template/jolt.json"));
            const templateKeys = Object.keys(templateConfig);

            for(let field of templateKeys) {
                if(typeof config[field] !== typeof templateConfig[field]) {
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
        const toolchain = (config.toolchain.startsWith("./")) ? path.join(process.cwd(), config.toolchain) : config.toolchain;
        const toolchainPath = (path.isAbsolute(toolchain)) ? toolchain : path.join(process.cwd(), "node_modules", toolchain);

        if(config.toolchain && fs.existsSync(toolchainPath)) return import(require.resolve(toolchain, { paths: [ process.cwd() ] }));
        else return null;
    }
}