import { assertEquals, } from "deno/testing/asserts.ts";



Deno.test("example", function (): void {
  assertEquals("world", "world");
  assertEquals({ hello: "world" }, { hello: "world" });
});
