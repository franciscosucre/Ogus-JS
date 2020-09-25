import {DefaultHandlerRunner, Handler} from "../handler-runner.ts";

import {Request} from '../request.ts'
import {Response} from '../response.ts'

export interface MiddlewareEngine {
    useMiddleware(...otherHandlers: Handler[]): MiddlewareEngine

    run(req: Request, res: Response, extraHandlers?: Handler[]): Promise<any>
}

export class DefaultMiddlewareEngine implements MiddlewareEngine {
    private defaultMiddleware: Handler[] = [];
    private readonly HandlerRunnerClass = DefaultHandlerRunner

    public useMiddleware(...handlers: Handler[]) {
        this.defaultMiddleware.push(...handlers)
        return this
    }

    public async run(req: Request, res: Response, extraHandlers: Handler[] = []) {
        const handlerRunner = new this.HandlerRunnerClass(this.createQueue(extraHandlers))
        await handlerRunner.run(req, res)
    }

    private createQueue(extraHandlers: Handler[]) {
        const queue: Handler[] = [...this.defaultMiddleware]
        return queue.concat(extraHandlers)
    }


}
