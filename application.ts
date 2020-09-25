import {HTTPOptions, serve, Server} from "https://deno.land/std/http/server.ts";

import {Request} from './request.ts'
import {Response} from './response.ts'
import {DefaultMiddlewareEngine, MiddlewareEngine} from './behaviors/middleware-engine.ts'
import {Handler} from "./handler-runner.ts";


export class Application {
    private readonly middlewareEngine: MiddlewareEngine = new DefaultMiddlewareEngine()
    private readonly denoServer: Server;

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
                const req = new Request({denoRequest})
                await req.fetchBody()
                const res = new Response({request: req})
                await this.middlewareEngine.run(req, res, callback ? [callback] : [])
            }
        } catch (e) {
            console.error("Unhandled Error: ", e)
        }

    }
}

