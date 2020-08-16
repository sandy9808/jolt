/* imports */
import { State } from "../common/State";
import { Compiler } from "../common/Compiler";

/**
 * Creates a Class Component with state management and lifecycle methods.
 * @class
 * @extends HTMLElement
 */
export class Component extends HTMLElement {

    constructor() {
        super();

        /** @type {ShadowRoot} */
        this.root = this.attachShadow({ mode: "open" });

        /** @type {State} */
        this.state = State.create(() => {
            Compiler.compile(this.render(), this.root);
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
        Compiler.compile(this.render(), this.root);
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
     * Regsiters a Component to make it available as an HTML element.
     * @param {string} name - The Component tag name.
     * @param {CustomElementConstructor|Function} component - The Component.
     */
    static register(name, component) {
        if (component.register) {
            window.customElements.define(name, component);
        } else {
            window.customElements.define(name, Compiler.wrap(component));
        }
    }

}