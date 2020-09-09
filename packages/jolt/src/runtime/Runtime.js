/* imports */
import { Reconciler } from "./Reconciler";

/**
 * @typedef {Object} ComponentOptions
 * @property {string} name
 * @property {string|Array.<string>} [styles]
 * @property {boolean} [useShadow=true]
 */

/**
 * Component Runtime, used to power the component internals.
 * @class
 * @private
 */
export class Runtime {

    static wrapFunction(component) {
        return class extends HTMLElement {

            constructor() {
                super();

                /* load the component options */
                const { useShadow } = Runtime.getComponentOptions(component);

                /**
                 * The component attributes
                 * @type {Object.<string,string>}
                 */
                this.attribs = Runtime.getComponentAttributes(this);

                /** 
                 * The component render root
                 * @type {ShadowRoot|HTMLElement}
                 */
                this.root = useShadow ? this.attachShadow({ mode: "open" }) : this;
            }

            connectedCallback() {
                Reconciler.reconcile(component(this.attribs), this.root);
            }
        }
    }

    /**
     * Gets the component options.
     * @param {CustomElementConstructor|Function} component
     * @return {ComponentOptions}
     */
    static getComponentOptions(component) {
        return {
            name: component.options.name,
            styles: component.options.styles,
            useShadow: component.options.useShadow,
        };
    }

    /**
     * Gets the component attributes.
     * @param {CustomElementConstructor|Function} component
     * @return {Object.<string,string>}
     */
    static getComponentAttributes(component) {
        const attributes = {};

        for (let attribute of component.attributes) {
            attributes[attribute.localName] = attribute.value;
        }

        return attributes;
    }

    static applyComponentStyles(component, styles) { }
}