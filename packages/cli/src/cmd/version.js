/* imports */
import { version as v } from "../../package.json";

/**
 * Logs the current cli version
 * @private
 */
function version() {
    console.log(`v${v}`);
}

export default version;