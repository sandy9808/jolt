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
            const requiredKeys = ["main", "dest", "toolchain"];

            for (let field of requiredKeys) {
                if (config[field] == undefined) return false;
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

    /**
     * Validates the toolchain to ensure all required exports are included.
     * @param {Object} toolchain
     * @return {boolean} 
     */
    static validateToolchain(toolchain) {
        if(!toolchain.build) {
            console.error(`The toolchain does not expose a "build" function.`);
            return false;
        }

        if(!toolchain.watch) {
            console.error(`The toolchain does not expose a "watch" function.`);
            return false;
        }

        if(!toolchain.lint) {
            console.error(`The toolchain does not expose a "lint" function.`);
            return false;
        }

        if(!toolchain.serve) {
            console.error(`The toolchain does not expose a "serve" function.`);
            return false;
        }

        if(!toolchain.defaultConfig) {
            console.error(`The toolchain does not expose a "defaultConfig" property.`);
            return false;
        }

        return true;
    }
}