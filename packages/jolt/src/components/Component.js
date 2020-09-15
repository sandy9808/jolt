/* imports */
import { Runtime } from "../runtime/Runtime";
import { Reconciler } from "../runtime/Reconciler";
import { html } from "../runtime/TemplateEngine";
import { State } from "./State";

/**
 * Component for building reusable pieces of a UI.
 * @class
 * @extends {HTMLElement}
 */
export class Component extends HTMLElement {

    constructor() {
        super();

        /* load the component options */
        const { useShadow, styles } = Runtime.getComponentOptions(this.constructor);
        this.styles = Runtime.createComponentStyle(styles);

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

        /**
         * The component state
         * @type {State}
         */
        this.state = State.createState((key, value) => {
            if (this.shouldUpdate(key, value)) {
                Runtime.render(this.render(this.attribs), this.styles, this.root);
                this.didUpdate(key, value);
            }
        });
    }

    /**
     * WebComponent lifecycle method for being added to the DOM.
     * @ignore
     */
    connectedCallback() {
        Runtime.render(this.render(this.attribs), this.styles, this.root);
        this.didLoad();

        /* observe the component attributes for changes */
        this._observer = Runtime.getAttributeObserver(this, (key, value) => {
            this.attribs[key] = value;

            if (this.shouldUpdate(key, value)) {
                Runtime.render(this.render(this.attribs), this.styles, this.root);
                this.didUpdate(key, value);
            }
        });
    }

    /**
     * WebComponent lifecycle method for being removed from the DOM.
     * @ignore
     */
    disconnectedCallback() {
        this.willUnload();
        this._observer.disconnect();
    }

    /**
     * Renders the Component.
     * @param {Object.<string,string>} [attribs]
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
     * Component lifecycle method for when the {@link State} or attributes change.
     * @param {string} [key]
     * @param {*} [value]
     * @abstract
     */
    didUpdate() { }

    /**
     * Component lifecycle method for determining if the view should update or not.
     * @param {string} [key] 
     * @param {*} [value]
     * @return {boolean} 
     */
    shouldUpdate() {
        return true;
    }

    /**
     * Component lifecycle method for being removed from the DOM.
     * @abstract
     */
    willUnload() { }

    /**
     * Registers a Component to make it available as an HTML element.
     * @param {ComponentOptions} options
     * @param {CustomElementConstructor|Function} component
     */
    static create(options, component) {
        component.options = options;

        if (!options.name) {
            console.warn("Jolt: ComponentOptions.name is required.");
            return;
        }

        if (component.create) window.customElements.define(options.name, component);
        else window.customElements.define(options.name, Runtime.wrapFunction(component));
    }

    /**
     * Mounts the component to the container element.
     * @param {CustomElementConstructor|Function} component 
     * @param {HTMLElement} container 
     */
    static mount(component, container) {
        if (component.options) Reconciler.reconcile(html`<${component.options.name}></${component.options.name}>`, container);
        else console.warn(`Jolt: Components must be registered before being used.`);
    }
}