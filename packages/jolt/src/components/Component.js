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
        const { useShadow } = Runtime.getComponentOptions(this.constructor);

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
            if(this.shouldUpdate(key, value)) {
                Reconciler.reconcile(this.render(this.attribs), this.root);
                this.didUpdate(key, value);
            }
        });

        /* observe the component attributes for changes */
        this._observer = Runtime.getAttributeObserver(this.root, (key, value) => {
            this.attribs[key] = value;
            if(this.shouldUpdate(key, value)) {
                Reconciler.reconcile(component(this.attribs), this.root);
                this.didUpdate(key, value);
            }
        });
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
        this._observer.disconnect();
    }

    /**
     * Renders the Component.
     * @param {Object.<string,string>} [attribs]
     * @abstract
     * @return {Template}
     */
    render() {}

    /**
     * Component lifecycle method for being added to the DOM.
     * @abstract
     */
    didLoad() {}

    /**
     * Component lifecycle method for when the {@link State} or attributes change.
     * @param {string} [key]
     * @param {*} [value]
     * @abstract
     */
    didUpdate() {}

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
     */
    willUnload() {}

    /**
     * Registers a Component to make it available as an HTML element.
     * @param {ComponentOptions} options
     * @param {CustomElementConstructor|Function} component
     */
    static create(options, component) {
        if(!options.name) {
            console.warn("Jolt: ComponentOptions.name is required.");
            return;
        }

        component.selector = options.name;
        component.options = Object.assign({
            useShadow: true
        }, options);

        if(component.create) {
            window.customElements.define(options.name, component);
        } else{
            window.customElements.define(options.name, Runtime.wrapFunction(component));
        }
    }

    /**
     * Mounts the component to the container element.
     * @param {CustomElementConstructor|Function} component 
     * @param {HTMLElement} container 
     */
    static mount(component, container) {
        if(component.selector) {
            Reconciler.reconcile(html`<${component.selector}></${component.selector}>`, container);
        } else {
            console.warn(`Jolt: Components must be created with "Component.create".`);
        }
    }
}