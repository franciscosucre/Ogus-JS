import {Request} from "./request.ts";
import {
  Status,
} from "https://deno.land/std@0.119.0/http/http_status.ts";



export class Response {
    private request: Request;
    public statusCode: Status = Status.OK;
    public body = '';
    public headers: Headers = new Headers()

    constructor({request}: { request: Request }) {
        this.request = request
    }

    status(statusCode: Status): Response {
        this.statusCode = statusCode
        return this
    }

    json(content: Record<string, unknown>): Response {
        this.body = JSON.stringify(content)
        this.headers.set("content-type", "application/json");
        this.request.respond(this.body, {
            headers: this.headers,
            status: Number(this.status.toString()),
        })
        return this
    }
}
