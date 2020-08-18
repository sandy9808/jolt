/* imports */
import { Compiler } from "./common/Compiler";

/**
 * Creates a Template to be rendered.
 * @param {TemplateStringsArray} strings - The string parts for the template.
 * @param {...*} values - The value parts for the template.
 * @return {Template}
 */
export function html(strings, ...values) {
    return Compiler.createTemplate(strings, values);
}

/**
 * Renders the component to the container element.
 * @param {CustomElementConstructor} component - The component to render.
 * @param {HTMLElement} container - The container element.
 */
export function render(component, container) {
    container.appendChild(document.createElement(component.selector));
}

export { State } from "./common/State";
export { Component } from "./components/Component";
