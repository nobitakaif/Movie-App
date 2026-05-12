import Elysia, { status, t } from "elysia";
import { RoomModel } from "./model";
import { RoomService } from "./service";
import jwt from "@elysiajs/jwt";
import { authMiddleware } from "../../plugins/authPlugins";


export const room = new Elysia({prefix : "/room"})
    .use(
        jwt({
            name : "jwt",
            secret : process.env.JWT_SECREt!
        })
    )
    .resolve(async({cookie : {auth}, jwt, status})=>{
        if(!auth?.value){
            return status(401, {
                error : "UNAUTHORIZED"
            })
        }
        console.log("\n\tauth token ", auth.value)
        const decodedToken = await jwt.verify(auth.value as string)
        console.log("decoded token -> ",decodedToken)
        if(!decodedToken || typeof decodedToken.sub !== "string"){
            return status(403, {
                msg : "invalid token!"
            })
        }
        console.log(decodedToken.sub)
        return {
            userId : decodedToken.sub
        }
    })
    .post("/", async function ({ body, userId, status }){
        const { name, videoUrl } = body

        const adminId = userId
        console.log(`adminId : ${adminId}\n\n`)
        const room = await RoomService.createRoom({ name, videoUrl, adminId})
        if('roomId' in room){
            return status(200, {
                roomId : room.roomId
            })
        }
        return status(400, {
            error : room.error,
            msg : room.msg
        })
    }, {
        body : RoomModel.createRoomSchema,
        response : {
            200 : RoomModel.createRoomResponse,
            400 : RoomModel.failedRoomCreation
        }
    })
    .get("/:roomId", async ({params})=>{
        console.log(params.roomId)   
        return status(200, {
            roomId : params.roomId
        })
    }, {
        params : t.Object({
            roomId : t.String()
        }),
        response : {
            200 : t.Object({
                roomId : t.String()
            })
        }
    })