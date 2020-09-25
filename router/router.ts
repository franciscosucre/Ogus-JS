import {DefaultMiddlewareEngine, MiddlewareEngine} from "../behaviors/middleware-engine.ts";
import {Route} from "./route.ts";
import {Handler} from "../core.ts";

export class Router {
    private middlewareEngine: MiddlewareEngine = new DefaultMiddlewareEngine();
    private routes: Route[] = []

    use(handler: Handler, ...otherHandlers: Handler[]) {
        this.middlewareEngine.useMiddleware(handler, ...otherHandlers)
        return this
    }

    addRoute(method: string, uri: string, handler: Handler, ...otherHandlers: Handler[]): Router {
        const match = this.routes.find(r => r.method === method && r.uri === uri)
        if (match){
            match.addHandlers([handler, ...otherHandlers])
        } else {
            this.routes.push(new Route(method, uri, [handler, ...otherHandlers]))
        }

        return this
    }

    get(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('get', uri, handler, ...otherHandlers)
    }

    post(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('post', uri, handler, ...otherHandlers)
    }

    patch(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('patch', uri, handler, ...otherHandlers)
    }

    put(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('put', uri, handler, ...otherHandlers)
    }

    delete(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('delete', uri, handler, ...otherHandlers)
    }

    options(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('options', uri, handler, ...otherHandlers)
    }

    head(uri: string, handler: Handler, ...otherHandlers: Handler[]){
        return this.addRoute('head', uri, handler, ...otherHandlers)
    }

    match(method: string, uri: string) {
        return this.routes.map(r => r.matchByPath(method, uri)).find(r => r)
    }

}

