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
    .resolve(async({cookie : {auth}, jwt, status, headers})=>{
        if(!auth?.value){
            return status(401, {
                error : "UNAUTHORIZED"
            })
        }
        console.log("\n\tauth token ", auth.value)

        const token = headers['authorization']
        console.log('auth headers -> ',token)
        const decodedToken = await jwt.verify(token)
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
    .get("/:roomName/:adminName", async ({params})=>{
        console.log(params.roomName)   
        const { roomName, adminName } = params
        const room = await RoomService.getRoomId({ roomName, adminName })
        if('msg' in room){
            return status(400, {
                msg : room.msg
            })
        }

        return status(200, {
            roomId : room.roomId,
            roomName : room.roomName,
            videoUrl : room.videoUrl ?? "URL not provided yet",

            admin : {
                adminId : room.admin.adminId,
                adminName : room.admin.adminName
            },

            roomMember : room.roomMember.map((member)=>({
                id : member.id,
                name : member.name,
                joinedAt : member.joinedAt
            })),
            playbackState : {
                currentTime : room.playbackState.currentTime,
                isPlaying : room.playbackState.isPlaying
            },
            roomCreatedAt : room.roomCreatedAt

        })
    }, {
        params : t.Object({
            roomName : t.String(),
            adminName : t.String()
        }),
        response : {
            200 : RoomModel.getRoomIdResponse,
            400 : RoomModel.getRoomIdFailed
        }
    })
    .post("/:roomName/:adminName/join", async ({ params, userId }) =>{
        const { roomName, adminName } = params
        
        const joinedRoom = await RoomService.joinRoom({ roomName, userId, adminName })
        if('id' in joinedRoom){
            return status(200, {
                msg : "user joined Successfull",
                success : joinedRoom.success,
                id : joinedRoom.id
            })
        }
        return status(400,{
            msg : joinedRoom.msg,
            success : joinedRoom.success
        })
    }, {
        params : t.Object({
            roomName : t.String(),
            adminName : t.String()
        }),
        response : {
            200 : RoomModel.joinRoomResponse,
            400 : RoomModel.joinRoomFailed
        }
    })
    .delete("/:roomId", async ({params, userId})=>{
        const { roomId } = params
        const isLeaved = await RoomService.leaveRoom({roomId, userId})
        if(isLeaved.success){
            return status(200, {
                success : isLeaved.success,
                msg : isLeaved.msg
            })
        }
        return status(400,{
            success : isLeaved.success,
            msg : isLeaved.msg
        })
    }, {
        params : t.Object({
            roomId : t.String()
        }),
        response : {
            200 : RoomModel.leaveRoomResponse,
            400 : RoomModel.leaveRoomResponse
        }
    })