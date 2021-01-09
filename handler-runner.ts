import {Request} from './request.ts';
import {Response} from './response.ts'

export type NextFunction = () => void | Promise<void>;
export type Handler = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>

export interface HandlerRunner {
    readonly handlers: Handler[];

    run(req: Request, res: Response): Promise<void>

    new(handlers: Handler[]): HandlerRunner;
}

// @ts-ignore
export class DefaultHandlerRunner implements HandlerRunner {
    readonly handlers: Handler[];

    constructor(handlers: Handler[]) {
        this.handlers = handlers
    }

    async run(req: Request, res: Response): Promise<void> {
        let idx = 0;
        if (this.handlers.length === 0) {
            return
        }
        const next: NextFunction = async (): Promise<void> => {
            if (idx >= this.handlers.length) {
                return
            }
            const layer = this.handlers[idx++];
            await layer(req, res, next);
        };
        await next();
    }
}
