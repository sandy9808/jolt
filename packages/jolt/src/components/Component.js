/* imports */
import { Runtime } from "../runtime/Runtime";
import { Reconciler } from "../runtime/Reconciler";
import { html } from "../runtime/TemplateEngine";

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

    /* returns the components template */
    render() {}

    /* gets called when the component is finished being added to the DOM */
    didLoad() {}

    /* gets called when the component is updated */
    didUpdate(key, value) {}

    /* gets called before updating the state, to determine if the dom should be updated or not */
    shouldUpdate(key, value) {
        return true;
    }

    /* gets called when the component is about to be removed from the DOM & memory */
    willUnload() {}

    /* creates a component with the options and component definition, making it usable */
    static create(options, component) {
        if(!options.name) {
            console.warn("Jolt: ComponentOptions.name is required.");
            return;
        }

        component.selector = options.name;
        component.options = Object.assign({
            useShadow: true
        }, options);

        if(component.constructor instanceof Component) {
            window.customElements.define(options.name, component);
        } else if(component.constructor instanceof Function) {
            window.customElements.define(options.name, Runtime.wrapFunction(component));
        } else {
            console.error("Jolt: Unsupported Component Definition.");
        }
    }

    /* mounts a component to a container element */
    static mount(component, container) {
        if(component.selector) {
            Reconciler.reconcile(html`<${component.selector}></${component.selector}>`, container);
        } else {
            console.warn(`Jolt: Components must be created with "Component.create".`);
        }
    }
}