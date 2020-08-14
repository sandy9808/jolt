/**
 * Request Callback
 * @callback RequestCallback
 * @param {http.ClientRequest} req - The http request.
 * @param {http.ServerResponse} res - The server response.
 */

/**
 * Application for responding to HTTP request
 * @class
 */
export class Application {

    /**
     * @param {http.Server} server 
     */
    constructor(server) {
        this._webServer = server;

        /**
         * The HTTP Server
         * @type {http.Server}
         */
        this.server = server._httpServer;
    }

    /**
     * Handles HTTP GET requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    get(url, callback) {
        this._webServer._endpoints[url] = { method: "GET", callback: callback };
    }

    /**
     * Handles HTTP POST requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    post(url, callback) {
        this._webServer._endpoints[url] = { method: "POST", callback: callback };
    }

    /**
     * Handles HTTP PUT requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    put(url, callback) {
        this._webServer._endpoints[url] = { method: "PUT", callback: callback };
    }

    /**
     * Handles HTTP PATCH requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    patch(url, callback) {
        this._webServer._endpoints[url] = { method: "PATCH", callback: callback };
    }

    /**
     * Handles HTTP DELETE requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    delete(url, callback) {
        this._webServer._endpoints[url] = { method: "DELETE", callback: callback };
    }
}