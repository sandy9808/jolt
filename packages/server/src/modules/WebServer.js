/* imports */
import http from "http";
import http2 from "http2";
import fs from "fs";
import path from "path";
import url from "url";
import MIME_TYPES from "../constants/MimeTypes";
import { Parser } from "../utils/Parser";
import { LiveReload } from "./LiveReload";

/**
 * Creates a WebServer to serve files from.
 * @class
 * @private
 */
export class WebServer {

    _httpServer = null;
    _protocol = "http";
    _fragments = [];
    _endpoints = {};
    _endpointParameters = {};

    /**
     * @param {Object} args - The command line arguments.
     */
    constructor(args) {
        this._root = Parser.getArg("root", "r", process.cwd(), args);
        this._file = Parser.getArg("file", "f", "index.html", args);
        this._port = Parser.getArg("port", "p", 3000, args);
        this._spa = Parser.getArg("spa", "s", null, args);
        this._live = Parser.getArg("live", "l", null, args);
        this._key = Parser.getArg("key", null, null, args);
        this._cert = Parser.getArg("cert", null, null, args);
        this._headers = Parser.getArg("headers", null, {}, args);
    }

    /** Starts the WebServer. */
    listen() {
        this._httpServer = this._createServer((req, res) => {

            const endpoint = this._resolveEndpoint(req);

            if (!endpoint) {
                if (this._live && req.url == "/reload") LiveReload.register(res);
                else this._handleRequest(req, res);
                return;
            }

            req.params = this._endpointParameters;

            let body = "";

            req.on("data", (data) => {
                body += data;
            });

            req.on("end", () => {
                if(body.length > 0) req.body = JSON.parse(body);
                else req.body = {};
                endpoint(req, res);
            });
        });

        this._httpServer.listen(this._port, () => {
            console.log(`Serving "${this._root}" at ${this._protocol}://localhost:${this._port}`);
        });

        if (this._live) LiveReload.enable(this);
    }

    /**
     * Creates the server with https if available and fallsback to http.
     * @param {function} callback - The callback to run when a request occurs.
     * @return {http.Server|http2.Http2SecureServer} The http server.
     * @private
     */
    _createServer(callback) {
        if (this._key && this._cert) {
            try {
                const options = {
                    key: fs.readFileSync(this._key),
                    cert: fs.readFileSync(this._cert)
                };
                this._protocol = "https";

                return http2.createSecureServer(options, callback);
            } catch {
                console.log("Failed to load SSL certificate.");
                return http.createServer(callback);
            }
        }

        return http.createServer(callback);
    }

    /**
     * match an url to the corresponding endpoint.
     * @param {string} endpoint - The endpoint to test for a match against.
     * @param {string} url - The url to find a match for.
     * @return {Array.<string>}
     * @private
     */
    _match(endpoint, url) {
        let names = [];
        let index = 0;

        const regex = endpoint
            .replace(/([:*])(\w+)\?/g, (full, colon, name) => {
                names[index++] = name;
                return "?([^/]+)?";
            })
            .replace(/([:*])(\w+)/g, (full, colon, name) => {
                names[index++] = name;
                return "([^/]+)";
            });

        const match = url.match(new RegExp(`^${regex}/?$`));

        if (match) {
            this._endpointParameters = match.slice(1).reduce((params, value, index) => {
                params[names[index]] = value;
                return params;
            }, {});
        }

        return match;
    }

    /**
     * Resolve an endpoint by its url
     * @param {string} url - The endpoint's url.
     * @return {Object} The resolved endpoint.
     * @private
     */
    _resolveEndpoint(req) {
        const endpoint = Object.keys(this._endpoints).filter((endpoint) => this._match(endpoint, req.url))[0];

        if (endpoint && this._endpoints[endpoint][req.method]) return this._endpoints[endpoint][req.method];
        else return null;
    }

    /**
     * Handles the HTTP requests.
     * @param {http.ClientRequest|http2.Http2ServerRequest} req - The request object.
     * @param {http.ServerResponse|http2.Http2ServerResponse} res - The response object.
     * @private
     */
    _handleRequest(req, res) {
        let pathname = path.join(this._root, path.normalize(url.parse(req.url).pathname));

        if (this._spa) {

            if (!pathname.includes(".")) {
                this._fragments = req.url.split("/");

                const filepath = path.join(this._root, this._file);

                if (this._live) LiveReload.inject(filepath, res);
                else this._serveFile(filepath, res);


            } else {
                for (let fragment of this._fragments) {
                    pathname = pathname.replace(fragment, "");
                }

                this._serveFile(path.normalize(pathname), res);
            }
        } else {
            fs.stat(pathname, (error, stats) => {
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

                if(stats.isDirectory()) {
                    pathname = path.join(pathname, this._file);
                }

                if(this._live && (pathname.endsWith(".html") || pathname.endsWith(".htm"))) LiveReload.inject(pathname, res);
                else this._serveFile(pathname, res);
            });
        }
    }

    /**
     * Serves a static file.
     * @param {string} filename - The file's name.
     * @param {http.ServerResponse|http2.Http2ServerResponse} res - The HTTP response.
     * @private
     */
    _serveFile(filename, res) {
        fs.readFile(filename, (error, data) => {
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

            const headers = Object.keys(this._headers);
            for(let header of headers) {
                res.setHeader(header, this._headers[header]);
            }

            const ext = path.parse(filename).ext;
            res.setHeader("Content-type", MIME_TYPES[ext] || "text/plain");
            res.end(data);
        });
    }
}