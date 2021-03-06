import {ServerRequest} from "https://deno.land/std/http/server.ts";
import {decode} from "https://deno.land/std/encoding/utf8.ts";

import {  } from "https://deno.land/std/path/mod.ts";

export class Request {
    public readonly denoRequest: ServerRequest;
    // Free property to be used for routers
    public params: {[key in string]: unknown} = {}
    public body = '';


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
        return this.denoRequest.url
    }


}
