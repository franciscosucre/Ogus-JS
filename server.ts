import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
import { encode, decode } from "https://deno.land/std/encoding/utf8.ts";
const s = serve({ port: 8000 });

console.log("http://localhost:8000/");

for await (const req: ServerRequest of s) {
  const request: ServerRequest = req;
  const body = JSON.parse(decode(await Deno.readAll(req.body)));
  console.log(body);
  console.log(request.contentLength);
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);

  const headers = new Headers();
  headers.set("content-type", "application/json");
  request.respond(jsonResponse({ content: body, headers, status: 201 }));
}

function jsonResponse({
  content,
  headers,
  status,
}: {
  content: object;
  status: number;
  headers: Headers;
}) {
  return { body: encode(JSON.stringify(content)), status, headers };
}
