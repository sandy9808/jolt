declare interface RouterOptions {
    useHash?: boolean;
    resetScrollPosition?: boolean;
}

declare interface Routes {
    [key: string]: CustomElementConstructor | Function;
}

declare interface Parameters {
    [key: string]: string;
}

declare class Router {

    private static _routes: Routes;
    private static _parameters: Parameters;
    private static _container: HTMLElement;

    static set(routes: Routes): void;
    static mount(container: HTMLElement, options?: RouterOptions): void;
    static on(route: string, component: CustomElementConstructor | Function): void;
    static notFound(component: CustomElementConstructor | Function): void;
    static navigate(url: string): void;
    static getParameters(): Parameters;
    private static _match(route: string, url: string): Array<string>;
    private static _resolve(url: string): void;
}

export { RouterOptions, Routes, Parameters, Router };