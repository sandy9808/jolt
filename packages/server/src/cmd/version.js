/* imports */
import { version as v } from "../../package.json";

/**
 * Logs the version of the package
 * @private
 */
function version() {
    console.log(`v${v}`);
}

export default version;