import type { ServerWebSocket } from "bun"
import { jwtVerify } from "./decodeToken"

type WebSocketType = {
    token: string,
    userId? : string
    roomId? : string
    isAdmin? : boolean
}

const rooms = new Map<string, Set<ServerWebSocket<WebSocketType>>>()
// how rooms look like 
// rooms = {
//    room123 => Set(ws1, ws2, ws3)
//    roomABC => Set(ws7, ws8, ws9) something like that 
// }

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
            let room = rooms.get(roomId)

            if (!room) {
                room = new Set()
                rooms.set(roomId, room)
            }

            ws.data.isAdmin = room.size === 0

            room.add(ws)

            console.log(
                `Rooms ${roomId} users :`,
                rooms.get(roomId)?.size
            )
        },
        message(ws, message){
            // frontend will send 'PLAY' (socket.send('PLAY'))
            const roomId = ws.data.roomId!
            const allUser = rooms.get(roomId)
            if(!allUser){
                return 
            }

            let data: any
            try{
                data = JSON.parse(message.toString())
            }catch(e){
                console.log("Data parsed FAILED! ")
                return 
            }

            // for requesting memeber to admin
            if(data.type === 'PLAY_REQUEST'){
                for(const client of allUser){
                    if(client.data.isAdmin){
                        client.send(JSON.stringify({
                            type : 'PLAY_REQUEST',
                            from : ws.data.userId
                        }))
                    }
                }
                return 
            }

            if(data.type === 'PLAY'){

                if(!ws.data.isAdmin){
                    ws.send(JSON.stringify({
                        type : "ERROR", 
                        message : "Only admin can control playback!"
                    }))
                    return  
                }
                
                for(const client of allUser){
                    if(client !== ws){
                        client.send(JSON.stringify({
                            type : "PLAY",
                            currentTime : data.currentTime ?? 0
                        }))
                        console.log("admin played the playback!")
                    }
                }
                return 
            }
        },
        close(ws) {
            const roomId = ws.data.roomId
            if (!roomId) return

            const room = rooms.get(roomId)
            if (!room) return

            room.delete(ws)

            if (room.size === 0) {
                rooms.delete(roomId)
                return
            }

            // if admin left → assign new admin
            let hasAdmin = false

            for (const client of room) {
                if (client.data.isAdmin) {
                    hasAdmin = true
                    break
                }
            }

            if (!hasAdmin) {
                const next = room.values().next().value
                if (next) next.data.isAdmin = true
            }
        }
    }
})

console.log("server is runnin on port : ", server.port)