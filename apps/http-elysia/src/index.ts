import { prisma } from "@repo/store/client";
import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { room } from "./modules/room";




const app = new Elysia({prefix : "/api/v1"})
  .use(auth)
  .use(room)
  .listen(8000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
