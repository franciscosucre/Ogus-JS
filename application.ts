import {HTTPOptions, serve, Server} from "https://deno.land/std/http/server.ts";

import {Request} from './request.ts'
import {Response} from './response.ts'
import {DefaultMiddlewareEngine, MiddlewareEngine} from './behaviors/middleware-engine.ts'
import {DefaultHandlerRunner, Handler, NextFunction} from "./core.ts";


export class Application {
    private readonly middlewareEngine: MiddlewareEngine = new DefaultMiddlewareEngine()
    private readonly denoServer: Server;
    private readonly HandlerRunnerClass = DefaultHandlerRunner

    constructor(options: Partial<HTTPOptions> = {}) {
        const {hostname = "0.0.0.0", port = 8000} = options
        this.denoServer = serve({hostname, port})
    }

    use(handler: Handler, ...otherHandlers: Handler[]) {
        this.middlewareEngine.useMiddleware(handler, ...otherHandlers)
        return this
    }

    async listen(callback?: Handler) {
        try {
            for await (const denoRequest of this.denoServer) {
                const request = new Request({denoRequest})
                await request.fetchBody()
                const response = new Response({request})

                const queue = this.middlewareEngine.createQueue(callback ? [callback] : [])
                const handlerRunner = new this.HandlerRunnerClass(queue)
                await handlerRunner.run(request, response)
            }
        } catch (e) {
            console.error("Unhandled Error: ", e)
        }

    }
}

