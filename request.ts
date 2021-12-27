import {BaseObject} from "./utility-types.ts"
import {
  Status,
} from "https://deno.land/std@0.119.0/http/http_status.ts";

export class Request {
    private readonly requestEvent: Deno.RequestEvent;
    // Free property to be used for routers
    public params: {[key in string]: unknown} = {}
    public query: {[key in string]: unknown} = {}


    constructor({requestEvent}: { requestEvent: Deno.RequestEvent }) {
        this.requestEvent = requestEvent
    }

    jsonBody(): Promise<BaseObject> {
        return this.requestEvent.request.json()
    }

    getHeader(key: string){
        return this.getRequest().headers.get(key)
    }

    getMethod() {
        return this.getRequest().method
    }

    getUrl(): URL {
        return new URL(this.getRequest().url)
    }

    respond(body: BodyInit, options?: Omit<ResponseInit, 'statusText'>){
        const {headers, status=Status.OK} = options || {}
        return this.requestEvent.respondWith(new Response(body, {
            headers,
            status,
        }))
    }

    private getRequest(){
        return this.requestEvent.request
    }

}
