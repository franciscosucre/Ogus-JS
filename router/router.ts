import {Route} from "./route.ts";
import {Request} from "../request.ts";
import {Response} from "../response.ts";
import {Handler} from "../handler-runner.ts";

export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
}

export class Router {

    private routes: Route[] = []

    use(handler: Handler, ...otherHandlers: Handler[]) {
        for (const route of this.routes) {
            route.addHandlers([handler, ...otherHandlers])
        }
        return this
    }

    addRoute(method: HttpMethods, uri: string, handler: Handler, ...otherHandlers: Handler[]): Router {
        const match = this.routes.find(r => r.method === method && r.uri === uri)
        if (match) {
            match.addHandlers([handler, ...otherHandlers])
        } else {
            this.routes.push(new Route(method, uri, [handler, ...otherHandlers]))
        }

        return this
    }

    get(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.GET, uri, handler, ...otherHandlers)
    }

    post(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.POST, uri, handler, ...otherHandlers)
    }

    patch(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.PATCH, uri, handler, ...otherHandlers)
    }

    put(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.PUT, uri, handler, ...otherHandlers)
    }

    delete(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.DELETE, uri, handler, ...otherHandlers)
    }

    options(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.OPTIONS, uri, handler, ...otherHandlers)
    }

    head(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        return this.addRoute(HttpMethods.HEAD, uri, handler, ...otherHandlers)
    }

    all(uri: string, handler: Handler, ...otherHandlers: Handler[]) {
        const routes = this.routes.filter(r => r.uri === uri)
        for (const route of routes) {
            route.addHandlers([handler, ...otherHandlers])
        }
    }

    match(method: string, pathname: string) {
        return this.routes.map(r => r.matchByPath(method, pathname)).find(r => r)
    }

    async handle(req: Request, res: Response) {
        const match = this.match(req.getMethod(), req.getUrl().pathname)
        if (!match) {
            throw new Error("Route not found")
        }
        const {route, params} = match
        req.params = params
        await route.handle(req, res)
    }

}
