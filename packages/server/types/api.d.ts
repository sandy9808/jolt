declare interface Options {
    port?: number,
    root?: string,
    file?: string,
    live?: boolean,
    spa?: boolean,
    key?: string,
    cert?: string
}

declare type ResponseCallback = (req: any, res: any) => void;

declare class Application {
    server: any;

    get(url: string, callback: ResponseCallback) : void;
    post(url: string, callback: ResponseCallback) : void;
    put(url: string, callback: ResponseCallback) : void;
    patch(url: string, callback: ResponseCallback) : void;
    delete(url: string, callback: ResponseCallback) : void;
}

declare function serve(options: Options) : Application;

export default serve;