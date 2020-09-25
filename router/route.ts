import {DefaultHandlerRunner, Handler} from "../core.ts";
import {Request} from '../request.ts'
import {Response} from '../response.ts'


export function normalize_uri(uri: string) {
    const segments = [""];
    for (const segment of uri.split("/")) {
        if (segment !== "") {
            segments.push(segment);
        }
    }
    return segments.join("/");
}

export type Params = { [key in string]: string }

export class Route {
    method: string;
    handlers: Handler[];
    uri: string;
    segments: string[];
    private readonly HandlerRunnerClass = DefaultHandlerRunner

    constructor(method: string, path: string, handlers: Handler[]) {
        this.handlers = handlers;
        this.method = method;
        this.uri = normalize_uri(path);
        this.segments = this.uri.split("/");
    }

    private match(method: string, segments: string[]): { params: Params; route: Route } | null {
        if (method !== this.method) {
            return null;
        }
        if (segments.length !== this.segments.length) {
            return null;
        }
        const params: Params = {};
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            if (segment[0] === ":") {
                params[segment.substring(1)] = segments[i];
            } else if (segment !== segments[i]) {
                return null;
            }
        }
        return {params, route: this};
    }

    matchByPath(method: string, path: string): { params: Params; route: Route } | null {
        const uri = normalize_uri(path);
        const segments = uri.split("/");
        return this.match(method, segments);
    }

    addHandlers(handlers: Handler[]) {
        this.handlers.push(...handlers)
    }

    async handle(req: Request, res: Response) {
        const runner = new this.HandlerRunnerClass(this.handlers)
        await runner.run(req, res)
    }
}
