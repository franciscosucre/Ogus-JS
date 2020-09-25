import {HTTPOptions, serve, Server} from "https://deno.land/std/http/server.ts";

import {Request} from './request.ts'
import {Response} from './response.ts'
import {DefaultMiddlewareEngine, MiddlewareEngine} from './behaviors/middleware-engine.ts'
import {Handler, NextFunction} from "./core.ts";


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
                const request = new Request({denoRequest})
                await request.fetchBody()
                const response = new Response({request})

                const queue = this.middlewareEngine.createQueue(callback ? [callback] : [])
                await this.runHandlers(request, response, queue)
            }
        } catch (e) {
            console.error("Unhandled Error: ", e)
        }

    }

    private async runHandlers(req: Request, res: Response, handlers: Handler[]) {
        let idx = 0;
        if (handlers.length === 0) {
            return
        }
        const next: NextFunction = async (): Promise<void> => {
            if (idx >= handlers.length) {
                return
            }
            const layer = handlers[idx++];
            await layer(req, res, next);
        };
        await next();
    }
}

