/* imports */
import fs from "fs";
import os from "os";
import path from "path";
import INJECTED_CODE from "../constants/InjectedCode";

/**
 * Enables LiveReload Functionality
 * @class
 * @private
 */
export class LiveReload {

    static _connections = [];
    static _fsWait = false;

    /**
     * Enables live reloading.
     * @param {WebServer} server - The web server to connect to.
     */
    static enable(server) {
        LiveReload.watch(server._root, (event, filename) => {
            if(filename) {
                if(LiveReload._fsWait) return;

                LiveReload._fsWait = setTimeout(() => {
                    LiveReload._fsWait = false;
                }, 100);

                LiveReload.reload();
            }
        });
    }

    /**
     * Register the connection with the live reloader.
     * @param {http.ServerResponse} res - The response to regiser.
     */
    static register(res) {
        res.writeHead(200, {
            "Content-type": "text-event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });

        LiveReload._connections.push(res);
    }

    /** Tell the connected browsers to reload */
    static reload() {
        for(let connection of LiveReload._connections) {
            connection.write("data: reload\n\n");
            LiveReload._connections.slice(LiveReload._connections.indexOf(connection), 1);
        }
    }

    /**
     * Injects the code into the requested html file.
     * @param {string} pathname - The file path.
     * @param {http.ServerResponse} res - The response object.
     */
    static inject(pathname, res) {
        let injectTag;

        fs.readFile(pathname, "utf8", (error, data) => {
            if(error) {
                if(error.errno == -2) {
                    res.statusCode = 404;
                    res.end(`ERROR 404: ${error.path} was not found.`);
                } else {
                    res.statusCode = 500;
                    res.end(error.message);
                }

                return;
            }

            const match = new RegExp("</body>", "i").exec(data);

            if(match) {
                injectTag = match[0];
            }

            if(injectTag) {
                res.setHeader("Content-type", "text/html");
                res.end(data.replace(injectTag, INJECTED_CODE + injectTag));
            }
        });
    }

    /**
     * Watches a file or directory for changes.
     * @param {string} target - The file or directory to watch.
     * @param {function} callback - The callback to use.
     */
    static watch(target, callback) {
        if(!["darwin", "win32"].includes(os.platform())) {
            if(fs.statSync(target).isDirectory()) {
                fs.watch(target, callback);
                fs.readdirSync(target).forEach((entry) => {
                    LiveReload.watch(`${path}/${entry}`, callback);
                });
            }
        } else {
            fs.watch(target, { recursive: true }, callback);
        }
    }
}