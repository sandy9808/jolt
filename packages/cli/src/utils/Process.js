/* imports */
import { spawn } from "child_process";

/**
 * Process Utilities
 * @class
 * @private
 */
export class Process {

    /** run npm cross platform */
    static npm(args, options={}) {
        return spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", args, options);
    }
}