declare interface Routes {
    [key: string]: CustomElementConstructor;
}

declare interface Parameters {
    [key: string]: string;
}

declare class Router {
    private static _routes: Routes;
    private static _parameters: Parameters;
    private static _container: HTMLElement;

    constructor(routes: Routes, container: HTMLElement);

    listen(useHash?: boolean): void;
    on(route: string, component: CustomElementConstructor): void;
    notFound(component: CustomElementConstructor): void;

    static navigate(url: string): void;
    static getParameters(): Parameters;

    private static _match(route: string, url: string): string[]
    private static _resolve(url: string): void;
}

export { Routes, Parameters, Router };