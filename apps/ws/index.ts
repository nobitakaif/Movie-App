import type { ServerWebSocket } from "bun"
import { jwtVerify } from "./decodeToken"

type WebSocketType = {
    token: string,
    userId? : string
    roomId? : string
}

const rooms = new Map<string, Set<ServerWebSocket<WebSocketType>>>()

const server = Bun.serve({
    fetch(req, serve){
        
        if (serve.upgrade(req, {
            data: {
                token: new URL(req.url).searchParams.get("token")!,
                roomId : new URL(req.url).searchParams.get("roomId")!
            }
        })) {
            return
        } 
        return new Response("Upgrade Failed", {status : 500})
    },
    port : 8888,
    websocket : {
        data :{} as WebSocketType,
        open(ws){
            ws.send("you're connected")
            // console.log(ws.data?.token)
            const user  =jwtVerify({token : ws.data.token})
            // console.log(userId)
            if(!user?.userId){
                ws.send("Invalid Token")
                ws.close()
                return
            }
            ws.data.userId = user.userId
            console.log('this is userId : ',ws.data.userId)

            const roomId = ws.data.roomId
            if(!roomId){
                ws.send("please provide roomId!")
                ws.close()
                return 
            }

            if(!rooms.has(roomId)){
                rooms.set(roomId, new Set())
            }

            rooms.get(roomId)?.add(ws)

            console.log(
                `Rooms ${roomId} users :`,
                rooms.get(roomId)?.size
            )
        },
        message(ws, message){
            if(message == 'ping'){
                ws.send('pong')
            }
        },
        close(ws){
            const roomId = ws.data.roomId!
            if(rooms.has(roomId)){
                rooms.get(roomId)?.delete(ws)
            }
            ws.send("you're disconnected!")
        }
    }
})

console.log("server is runnin on port : ", server.port)