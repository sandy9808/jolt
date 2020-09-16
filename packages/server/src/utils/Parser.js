/**
 * Parser Utilities
 * @class
 * @private
 */
export class Parser {

    /**
     * Parses the CLI Arguments
     * @param {Object} args 
     */
    static parseArguments(args) {
        const tmp = {};
        tmp._ = [];

        let arg;
        let newArg;

        const length = args.length;
        for (let i = 0; i < length; i++) {
            arg = args[i];
            newArg = [];

            if(arg.startsWith("-") && !arg.startsWith("--")) {
                arg.replace(/-/, "--");
            }

            if(arg.startsWith("--")) {
                newArg.push(arg.slice(2));
                const tmpArg = args[i + 1];

                if(tmpArg != null && !tmpArg.startsWith("--")) {
                    newArg.push(tmpArg);
                    args.slice(args.indexOf(tmpArg), 1);
                } else {
                    newArg.push(true);
                }

                tmp[newArg[0]] = newArg[1];
            } else {
                tmp._.push(arg);
            }
        }

        return tmp;
    }

    /**
     * Gets the argument value or returns a fallback value.
     * @param {string} name 
     * @param {string} alt
     * @param {*} fallback
     * @param {Object} args
     * @param {*}
     */
    static getArg(name, alt, fallback, args) {
        return (args[name]) || (args[alt]) ? args[name] || args[alt] : fallback;
    }
}