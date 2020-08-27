/* imports */
import { TemplateEngine } from "./compiler/TemplateEngine";
import { Reconciler } from "./compiler/Reconciler";


/**
 * Creates a Template to be rendered.
 * @param {TemplateStringsArray} strings - The string parts for the template.
 * @param {...*} values - The value parts for the template.
 * @return {Template}
 */
export function html(strings, ...values) {
    return TemplateEngine.createTemplate(strings, values);
}

/**
 * Renders the component to the container element.
 * @param {CustomElementConstructor|Function} component - The component to render.
 * @param {HTMLElement} container - The container element.
 */
export function render(component, container) {
    if(component.selector) {
        Reconciler.reconcil(html`<${component.selector}></${component.selector}>`, container);
    } else {
        console.warn("Jolt: Component has not been registered!");
    }
}

export { State } from "./components/State";
export { Component } from "./components/Component";
