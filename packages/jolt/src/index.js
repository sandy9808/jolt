/* imports */
import { TemplateEngine } from "./runtime/TemplateEngine";
import { Reconciler } from "./runtime/Reconciler";

/**
 * Creates a {@link Template} to be rendered.
 * @param {TemplateStringsArray} strings 
 * @param  {...*} values
 * @return {Template}
 */
export function html(strings, ...values) {
    return TemplateEngine.createTemplate(strings, values);
}

/**
 * Renders the component to the container element.
 * @param {CustomElementConstructor|Function} component 
 * @param {HTMLElement} container 
 */
export function render(component, container) {
    if(component.selector) Reconciler.reconcile(html`<${component.selector}></${component.selector}>`, container);
    else console.warn("Jolt: Components must be registered before being rendered.");
}

export { Component } from "./components/Component";