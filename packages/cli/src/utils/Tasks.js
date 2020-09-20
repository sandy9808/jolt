/* imports */
import { spawn, exec } from "child_process";

/**
 * Process Utilities
 * @class
 * @private
 */
export class Tasks {

    /** run npm cross platform */
    static npm(args, options = {}) {
        return spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", args, options);
    }

    /** run git init */
    static git(options, callback) {
        return exec("git init", options, callback);
    }
}