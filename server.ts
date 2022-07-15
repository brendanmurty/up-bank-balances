import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const app = new Application();

app.use((context) => {
  // TODO: Using similar code to "cli.ts", construct HTML code showing the account summary and recent transactions

  context.response.body = "Hello World!";
});

await app.listen({ port: 8001 });
