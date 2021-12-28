import {Handler} from "../handler-runner.ts";
import {Request} from '../request.ts'
import {Response} from '../response.ts'
import {DefaultMiddlewareEngine, MiddlewareEngine} from "../behaviors/middleware-engine.ts";


export function normalizeUri(uri: string) {
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
    public method: string;
    public uri: string;
    private readonly  segments: string[];
    private readonly  middlewareEngine: MiddlewareEngine = new DefaultMiddlewareEngine();

    constructor(method: string, path: string, handlers: Handler[]) {
        this.method = method;
        this.uri = normalizeUri(path);
        this.segments = this.uri.split("/");
        this.middlewareEngine.useMiddleware(...handlers)
    }

    private match(method: string, segments: string[]): { params: Params; route: Route } | null {
        console.log(method, segments)
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
        const uri = normalizeUri(path);
        const segments = uri.split("/").map(s => s);
        return this.match(method, segments);
    }

    addHandlers(handlers: Handler[]) {
        const [first, ...rest] = handlers
        this.middlewareEngine.useMiddleware(first, ...rest)
    }

    async handle(req: Request, res: Response) {
        await this.middlewareEngine.run(req, res)
    }
}
