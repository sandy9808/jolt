declare type StateCallback = (state?: Object, key?: string | number | symbol, value?: any) => void;

declare class State {
    private prototype;
    private static currentHook;
    private static hooks;

    set(state: Object): void;

    static useState(state: Object, callback?: StateCallback): Object;
    static create(callback?: StateCallback): State;
    static createArrayProxy(array: Array<any>, callback?: StateCallback): any[];
}

declare abstract class Component extends HTMLElement {
    root: ShadowRoot;
    state: State;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    abstract render(): Template;
    didLoad(): void;
    didUpdate(): void;
    willUnload(): void;
    static register(name: string, component: CustomElementConstructor): void;
}

interface Template {
    template: HTMLTemplateElement;
    events: Function[];
}
declare function html(strings: TemplateStringsArray, ...values: any[]): Template;
declare function render(component: Template, container: HTMLElement): void;

export { Component, State, Template, html, render };