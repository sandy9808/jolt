/* imports */
import server from "@jolt/server";
import watch from "./watch";

/**
 * 
 */
function serve(options) {
    runTasks([
        function() {
            watch(options);
        },
        function() {
            server(options);
        }
    ], function(error) {
        console.error(error.message);
    });
}

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