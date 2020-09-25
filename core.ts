import {Request} from './request.ts';
import {Response} from './response.ts'

export type NextFunction = () => any;
export type Handler = (req: Request, res: Response, next?: NextFunction) => any
