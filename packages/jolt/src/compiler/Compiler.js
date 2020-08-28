/* imports */
import { Reconciler } from "./Reconciler";

/**
 * Observer Callback
 * @callback ObserverCallback
 * @param {string} [name] - The attribute name.
 * @param {string} [value] - The new attribute value.
 */

/**
 * Compiler for creating Component Systems
 * @class
 * @private
 */
export class Compiler {

    /**
     * Monitors an elements attributes for changes.
     * @param {HTMLElement} element - The element to monitor.
     * @param {ObserverCallback} callback - The callback to run when a change happens.
     * @return {MutationObserver}
     */
    static createAttributeObserver(element, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type == "attributes") {
                    const name = mutation.attributeName;
                    callback(name, mutation.target.getAttribute(name));
                }
            });
        });

        observer.observe(element, { attributes: true });

        return observer;
    }

    /**
     * Wraps a function component into a web component class.
     * @param {Function} component - The function component to wrap/
     * @return {CustomElementConstructor}
     */
    static wrap(component) {
        return class extends HTMLElement {

            constructor() {
                super();

                this.root = this.attachShadow({ mode: "open" });
                
                /* parse the attributes */
                this.attribs = {};
                for (let attrib of this.attributes) {
                    this.attribs[attrib.localName] = attrib.value;
                }
            }

            connectedCallback() {
                Reconciler.reconcil(component(this.attribs), this.root);

                /* monitor the components attributes for changes */
                this._attributeObserver = Compiler.createAttributeObserver(this.root, (name, newValue) => {
                    this.attribs[name] = newValue;

                    Reconciler.reconcil(component(this.attribs), this.root);
                });
            }

            disconnectedCallback() {
                this._attributeObserver.disconnect();
            }
        };
    }
}