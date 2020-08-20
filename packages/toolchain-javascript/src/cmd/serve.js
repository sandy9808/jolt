/* imports */
import server from "@jolt/server";
import watch from "./watch";

/**
 * Run a live reloading development server and rebuild the app when a file changes.
 * @param {Object} options
 */
function serve(options) {

    if(options.production || options.p) {
        server(options.server || options);
    } else {
        runTasks([
            function() {
                watch(options);
            },
            function() {
                server(options.server || options);
            }
        ], function(error) {
            console.error(error.message);
        });
    }
}

/**
 * Run tasks in parallel.
 * @param {Array.<Function>} tasks - A list of functions to run at the same time.
 * @param {Function} callback - An error callback if a function fails.
 */
function runTasks(tasks, callback) {
    let results = [];
    let pending = tasks.length;
    let isSync = true;

    function done(error) {
        function end() {
            if(callback) callback(error, results);
            callback = null;
        }

        if(isSync) process.nextTick(end);
        else end();
    }

    function each(index, error, result) {
        results[index] = result;

        if(--pending == 0 || error) done(error);
    }

    if(!pending) done(null);
    else {
        tasks.forEach((task, index) => {
            task((error, result) => each(index, error, result));
        });
    }
}

export default serve;