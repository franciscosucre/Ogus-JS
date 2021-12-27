import { Request } from "./request.ts";
import { Response } from "./response.ts";
import {
  DefaultMiddlewareEngine,
  MiddlewareEngine,
} from "./behaviors/middleware-engine.ts";
import { Handler } from "./handler-runner.ts";
import {QueryParamsParser} from "./query-params-parser.ts"

export class Application {
  private readonly middlewareEngine: MiddlewareEngine =
    new DefaultMiddlewareEngine();
  private readonly requestHandler?: Handler;
  private readonly queryParamParser: QueryParamsParser
  public readonly hostname: string;
  public readonly port: number;

  constructor(
    options: Partial<Deno.ListenOptions> & { requestHandler?: Handler, queryParamParser?: QueryParamsParser } = {}
  ) {
    const { hostname = "0.0.0.0", port = 8000, requestHandler, queryParamParser= new QueryParamsParser(QueryParamsParser.defaultConvertors) } = options;
    this.requestHandler = requestHandler;
    this.queryParamParser = queryParamParser
    this.hostname = hostname;
    this.port = port;
  }

  use(handler: Handler, ...otherHandlers: Handler[]) {
    this.middlewareEngine.useMiddleware(handler, ...otherHandlers);
    return this;
  }

  async listen(callback?: () => void | Promise<void>) {
    callback ? await callback() : null;
    try {
      const server = await Deno.listen({
        port: this.port,
        hostname: this.hostname,
      });
      for await (const denoConnection of server) {
        const denoHttpConnection = Deno.serveHttp(denoConnection);
        for await (const requestEvent of denoHttpConnection) {

          const req = new Request({ requestEvent });
          const queryParams = this.queryParamParser.parse(req.getUrl())
          req.query = queryParams

          const res = new Response({ request: req });
          await this.middlewareEngine.run(
            req,
            res,
            this.requestHandler ? [this.requestHandler] : []
          );
        }
      }
    } catch (e) {
      console.error("Unhandled Error: ", e);
    }
  }
}
