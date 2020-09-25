import {ServerRequest} from "https://deno.land/std/http/server.ts";
import {decode} from "https://deno.land/std/encoding/utf8.ts";


export class Request {
    public readonly denoRequest: ServerRequest;
    public body: string = '';


    constructor({denoRequest}: { denoRequest: ServerRequest }) {
        this.denoRequest = denoRequest
    }

    async fetchBody() {
        this.body = decode(await Deno.readAll(this.denoRequest.body))
    }

    get jsonBody() {
        return this.body ? JSON.parse(this.body): {}
    }

    get contentLength() {
        return this.denoRequest.contentLength
    }

    get headers() {
        return this.denoRequest.headers
    }

    get method() {
        return this.denoRequest.method
    }

    get url() {
        this.denoRequest.
        return this.denoRequest.url
    }


}

