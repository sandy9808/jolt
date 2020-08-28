/* Jolt Router */

/* imports */
import { render } from "jolt";

/**
 * Creates a Router that handles parsing parameterized routes,
 * and rendering the component associated with the current url.
 * @class
 */
export class Router {

    /**
     * @param {Object.<string, CustomElementConstructor>} routes - The mapping of components to their routes. 
     * @param {HTMLElement} container - The app container element.
     */
    constructor(routes, container) {
        Router._routes = routes;
        Router._container = container;
    }

    /**
     * Starts the Router's routing mechanism.
     * @param {boolean} [useHash=false] - Enable hash based routing.
     */
    listen(useHash=false) {
        const mode = useHash ? "hashchange" : "popstate";
        
        window.addEventListener(mode, () => {
            Router._resolve(useHash ? (window.location.hash.slice(1) || "/") : (window.location.pathname || "/"));
        });

        Router._resolve(useHash ? (window.location.hash.slice(1) || "/") : (window.location.pathname || "/"));
    }

    /**
     * Adds a route to the Router's route mapping.
     * @param {string} route - The route to add to the mapping.
     * @param {CustomElementConstructor} component - The component to render when the route is requested.
     */
    on(route, component) {
        Router._routes[route] = component;
    }

    /**
     * Sets the component to be rendered when the router can not find a matching route.
     * @param {CustomElementConstructor} component - The view to be rendered when a 404 error occurs.
     */
    notFound(component) {
        Router._routes["notFound"] = component;
    }

    /**
     * Navigates to the desired url.
     * @param {string} url - The url to navigate to.
     */
    static navigate(url) {
        window.history.pushState({}, url, (window.location.origin + url));
        Router._resolve(url);
    }

    /**
     * Gets the active route's parameters.
     * @return {Object.<string, string>}
     */
    static getParameters() {
        return Router._parameters;
    }
    
    /**
     * Matches a url to a route.
     * @param {string} route - The route to test for a match against.
     * @param {string} url - The url to find a match for.
     * @return {Array}
     * @private
     */
    static _match(route, url) {
        const names = [];

        const regexPath = route.replace(/([:.*?])(\w+)/g, (full, colon, name) => {
            names.push(name);
            return "?([^/]+)";
        }).replace(/([:.*])(\w+)/g, (full, colon, name) => {
            names.push(name);
            return "([^/]+)";
        }) + "(?:/|$)";

        const match = url.match(new RegExp(regexPath));

        if (match) {
            Router._parameters = match.slice(1).reduce((params, value, index) => {
                params[names[index]] = value;
                return params;
            }, {});
        }

        return match;
    }

    /**
     * Resolves the component associted with the url.
     * @param {string} url - The requested url.
     * @private
     */
    static _resolve(url) {
        const route = Object.keys(Router._routes).filter((route) => Router._match(route, url))[0];
        if (route != null) {
            render(Router._routes[route], Router._container);

        } else {
            const notFoundRoute = Router._routes["notFound"];

            if (!notFoundRoute) {
                document.write(`ERROR 404: ${url} not found!`);
                return;
            }

            render(notFoundRoute, Router._container);
        }
    }
}

Router._routes = {};
Router._parameters = {};
Router._container = null;