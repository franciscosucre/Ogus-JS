import {Handler} from "../core.ts";

export interface MiddlewareEngine {
    useMiddleware(firstHandler: Handler, ...otherHandlers: Handler[]): MiddlewareEngine

    createQueue(extraHandlers: Handler[]): Handler[]
}

export class DefaultMiddlewareEngine implements MiddlewareEngine {
    private defaultMiddleware: Handler[] = [];

    public useMiddleware(firstHandler: Handler, ...otherHandlers: Handler[]) {
        this.defaultMiddleware.push(...[firstHandler, ...otherHandlers])
        return this
    }

    public  createQueue(extraHandlers: Handler[]) {
        const queue: Handler[] = [...this.defaultMiddleware]
        return queue.concat(extraHandlers)
    }

}
