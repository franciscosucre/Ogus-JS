import {HTTPOptions, serve, Server} from "https://deno.land/std/http/server.ts";

import {Request} from './request.ts'
import {Response} from './response.ts'
import {DefaultMiddlewareEngine, MiddlewareEngine} from './behaviors/middleware-engine.ts'
import {Handler} from "./handler-runner.ts";


export class Application {
    private readonly middlewareEngine: MiddlewareEngine = new DefaultMiddlewareEngine()
    private readonly denoServer: Server;
    private readonly requestHandler?: Handler;
    public readonly hostname: string
    public readonly port: number

    constructor(options: Partial<HTTPOptions> & { requestHandler?: Handler } = {}) {
        const {hostname = "0.0.0.0", port = 8000, requestHandler} = options
        this.denoServer = serve({hostname, port})
        this.requestHandler = requestHandler
        this.hostname = hostname
        this.port = port
    }

    use(handler: Handler, ...otherHandlers: Handler[]) {
        this.middlewareEngine.useMiddleware(handler, ...otherHandlers)
        return this
    }

    async listen(callback?: () => void | Promise<void>) {
        callback ? await callback() : null
        try {
            for await (const denoRequest of this.denoServer) {
                const req = new Request({denoRequest})
                await req.fetchBody()
                const res = new Response({request: req})
                await this.middlewareEngine.run(req, res, this.requestHandler ? [this.requestHandler] : [])
            }
        } catch (e) {
            console.error("Unhandled Error: ", e)
        }

    }
}
