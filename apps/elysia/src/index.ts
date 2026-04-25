import { Elysia } from "elysia";
import { auth } from "./better-auth/auth";
import { userAuth } from "./module/user";


const app = new Elysia().mount(auth.handler)
  .use(userAuth)
  .get("/", () => "Hello Elysia").listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
