/* imports */
import { State } from "../common/State";
import { Compiler } from "../common/Compiler";

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

    /**
     * @param {ComponentOptions} options 
     */
    constructor(options={}) {
        super();

        /** @type {ShadowRoot} */
        this.root = options.disableShadowDOM ? this : this.attachShadow({ mode: "open" });

        /** @type {State} */
        this.state = State.create(() => {
            Compiler.compile(this.render(this.attribs), this.root);
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
        Compiler.compile(this.render(this.attribs), this.root);
        this.didLoad();

        /* monitor the components attributes for changes */
        this._attributeObserver = Compiler.createAttributeObserver((name, newValue) => {
            this.attribs[name] = newValue;

            Compiler.compile(this.render(this.attribs), this.root);
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
     * @param {string} name - The Component tag name.
     * @param {CustomElementConstructor} component - The Component.
     */
    static register(name, component) {
        window.customElements.define(name, component);
    }

}