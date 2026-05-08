import { prisma } from "@repo/store/client";
import { Elysia } from "elysia";
import { auth } from "./modules/auth";




const app = new Elysia({prefix : "/api/v1"})
  .use(auth)
  .listen(8000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
