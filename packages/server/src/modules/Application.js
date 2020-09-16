/**
 * Request Callback
 * @callback RequestCallback
 * @param {http.ClientRequest} req - The http request.
 * @param {http.ServerResponse} res - The server response.
 */

/**
 * Application for responding to HTTP requests.
 * @class
 */
export class Application {

    /**
     * @param {http.Server} server 
     */
    constructor(server) {
        this._webServer = server;
        this.server = server._httpServer;
    }

    /**
     * Handles HTTP GET requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    get(url, callback) {
        this._webServer._endpoints[url] = this._webServer._endpoints[url] || {};
        this._webServer._endpoints[url]["GET"] = callback;
    }

    /**
     * Handles HTTP POST requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    post(url, callback) {
        this._webServer._endpoints[url] = this._webServer._endpoints[url] || {};
        this._webServer._endpoints[url]["POST"] = callback;
    }

    /**
     * Handles HTTP PUT requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    put(url, callback) {
        this._webServer._endpoints[url] = this._webServer._endpoints[url] || {};
        this._webServer._endpoints[url]["PUT"] = callback;
    }

    /**
     * Handles HTTP PATCH requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    patch(url, callback) {
        this._webServer._endpoints[url] = this._webServer._endpoints[url] || {};
        this._webServer._endpoints[url]["PATCH"] = callback;
    }

    /**
     * Handles HTTP DELETE requests on the specified url.
     * @param {string} url - The url to run the callback on.
     * @param {ResponseCallback} callback - The callback to run when the url is requested.
     */
    delete(url, callback) {
        this._webServer._endpoints[url] = this._webServer._endpoints[url] || {};
        this._webServer._endpoints[url]["DELETE"] = callback;
    }
}