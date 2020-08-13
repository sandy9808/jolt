/* imports */
import { File } from "./File";
import path from "path";

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
     * Loads the toolchain from the config.
     * @param {Object} config
     * @return {Object}
     */
    static loadToolchain(config) {
        // TODO - Build proper toolchain loading
        if(config.toolchain) return import(path.join(process.cwd(), config.toolchain));
        else return null;
    }
}