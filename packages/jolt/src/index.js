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
 * Renders the template to the container element.
 * @param {Template} template - The template to render.
 * @param {HTMLElement} container - The container element.
 */
export function render(template, container) {
    Compiler.compile(template, container);
}

export { State } from "./common/State";
export { Component } from "./components/Component";
