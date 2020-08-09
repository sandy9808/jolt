/* imports */
import { State } from "../common/State";
import { Compiler } from "../common/Compiler";

/**
 * Creates a WebComponent with an simple wrapper API, with additional features.
 * @class
 * @extends HTMLElement
 */
export class Component extends HTMLElement {

    constructor() {
        super();

        /**
         * The Component root.
         * @type {ShadowRoot}
         */
        this.root = this.attachShadow({ mode: "open" });

        /**
         * The state of the Component.
         * @type {State}
         */
        this.state = State.create(() => {
            Compiler.compile(this.render(), this.root);
            this.didUpdate();
        });
    }

    /**
     * WebComponent lifecycle method for being added to the DOM.
     * @private
     */
    connectedCallback() {
        Compiler.compile(this.render(), this.root);
        this.didLoad();
    }

    /**
     * WebComponent lifecycle method for being removed from the DOM.
     * @private
     */
    disconnectedCallback() {
        this.willUnload();
    }

    /**
     * Renders the Component.
     * @return {Template}
     * @abstract
     */
    render() { }

    /**
     * Callback for when a Component is added to the DOM.
     * @abstract
     */
    didLoad() { }

    /**
     * Callback for when a Component's state is updated.
     */
    didUpdate() { }

    /**
     * Callback for when a Component is being removed from the DOM.
     * @abstract
     */
    willUnload() { }

    /**
     * Regsiters the Component to make it available as an HTML tag.
     * @param {string} name - The Component tag name.
     * @param {*} component - The Component.
     */
    static register(name, component) {
        window.customElements.define(name, component);
    }
}