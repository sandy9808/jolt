/* imports */
import { State } from "./State";
import { Compiler } from "../compiler/Compiler";
import { Reconciler } from "../compiler/Reconciler";

/**
 * @typedef {Object} ComponentOptions
 * @property {boolean} [disableShadowDOM=false] - If true, the component will not use a Shadow DOM.
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
        this.root = this.constructor.options.disableShadowDOM ? this : this.attachShadow({ mode: "open" });

        /** @type {State} */
        this.state = State.create(() => {
            Reconciler.reconcil(this.render(this.attribs), this.root);
            this.didUpdate();
        });

        /** @type {Object.<string, string>} */
        this.attribs = {};

        for (let attrib of this.attributes) {
            this.attribs[attrib.localName] = attrib.value;
        }
    }

    /**
     * WebComponent lifecycle method for being added to the DOM.
     * @ignore
     */
    connectedCallback() {
        Reconciler.reconcil(this.render(this.attribs), this.root);
        this.didLoad();

        /* monitor the components attributes for changes */
        this._attributeObserver = Compiler.createAttributeObserver(this, (name, newValue) => {
            this.attribs[name] = newValue;

            Reconciler.reconcil(this.render(this.attribs), this.root);
            this.didUpdate();
        });
    }

    /**
     * WebComponent lifecycle method for being removed from the DOM.
     * @ignore
     */
    disconnectedCallback() {
        this.willUnload();
        this._attributeObserver.disconnect();
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
     * Regsiters a Component to make it available as an HTML element.
     * @param {string} selector - The Component's selector.
     * @param {CustomElementConstructor|Function} component - The Component to register.
     * @param {ComponentOptions} [options] - The Component Options
     */
    static register(selector, component, options={}) {
        component.selector = selector;
        component.options = options;

        if (component.register) {
            window.customElements.define(selector, component);
        } else {
            window.customElements.define(selector, Compiler.wrap(component));
        }
    }

}