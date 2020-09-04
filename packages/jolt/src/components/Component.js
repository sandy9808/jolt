/* imports */
import { Reconciler } from "../runtime/Reconciler";

/**
 * @typedef {Object} ComponentOptions
 * @property {string} name
 * @property {boolean} [useShadow=true]
 * @property {string|Array.<string>} [styles]
 */

/**
 * Creates a Class Component with state management and lifecycle methods.
 * @class
 * @extends HTMLElement
 */
export class Component extends HTMLElement {

    constructor() {
        super();

        /** @type {ShadowRoot} */
        this.root = (this.constructor.options.useShadow) ? this.attachShadow({ mode: "open" }) : this;

        /** @type {Object.<string, string>} */
        this.attribs = {};

        for (let attribute of this.attributes) {
            this.attribs[attribute.localName] = attribute.value;
        }
    }

    /**
     * WebComponent lifecycle method for being added to the DOM.
     * @ignore
     */
    connectedCallback() {
        Reconciler.reconcile(this.render(this.attribs), this.root);
        this.didLoad();
    }

    /**
     * WebComponent lifecycle method for being removed from the DOM.
     * @ignore
     */
    disconnectedCallback() {
        this.willUnload();
    }

    /**
     * Renders the Component.
     * @abstract
     * @return {Template}
     */
    render() { }

    /**
     * Component lifecycle method for being added to the DOM.
     * @abstract
     */
    didLoad() { }

    /**
     * Component lifecycle method for when the {@link State} is updated.
     * @abstract
     */
    didUpdate() { }

    /**
     * Component lifecycle method for being removed from the DOM.
     * @abstract
     */
    willUnload() { }

    /**
     * Registers a Component to make it available as an HTMLElement.
     * @param {ComponentOptions} options,
     * @param {CustomElementConstructor|Function} component
     */
    static register(options, component) {
        component.selector = options.name;
        component.options = options;
        window.customElements.define(options.name, component);
    }
}