import {Route} from "./route.ts";
import {Request} from "../request.ts";
import {Response} from "../response.ts";
import {Handler} from "../handler-runner.ts";

export class Router {

    private routes: Route[] = []

    use(handler: Handler, ...otherHandlers: Handler[]) {
        for (const route of this.routes) {
            route.addHandlers([handler, ...otherHandlers])
        }
        return this
    }

    addRoute(method: string, uri: string, handler: Handler, ...otherHandlers: Handler[]): Router {
        const match = this.routes.find(r => r.method === method && r.uri === uri)
        if (match) {
            match.addHandlers([handler, ...otherHandlers])
        } else {
            this.routes.push(new Route(method, uri, [handler, ...otherHandlers]))
        }

        return this
    }

    get(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('GET', uri, handler, ...otherHandlers)
    }

    post(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('POST', uri, handler, ...otherHandlers)
    }

    patch(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('PATCH', uri, handler, ...otherHandlers)
    }

    put(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('PUT', uri, handler, ...otherHandlers)
    }

    delete(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('DELETE', uri, handler, ...otherHandlers)
    }

    options(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('OPTIONS', uri, handler, ...otherHandlers)
    }

    head(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute('HEAD', uri, handler, ...otherHandlers)
    }

    match(method: string, uri: string) {
        return this.routes.map(r => r.matchByPath(method, uri)).find(r => r)
    }

    async handle(req: Request, res: Response) {
        const match = this.match(req.method, req.url)
        if (!match) {
            throw new Error("Route not found")
        }
        const {route, params} = match
        req.params = params
        await route.handle(req, res)
    }

}

