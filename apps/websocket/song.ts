type User = {
    ws : any, 
    name : string, 
    roomId : string, 
    isAdmin : boolean
}

type Room = {
    songUrl : string,
    isPlaying : boolean,
    startedAt : number,
    pausedAt? : number
}

type Data = 
    | { type: "join_room"; name: string; roomId: string }
    | { type: "play_song"; roomId: string; songUrl: string }
    | { type: "pause_song"; roomId: string }
    | { type: "resume_song"; roomId: string };

const users : User[] = []
const rooms = new Map<string, Room>()

function broadcastToRoom(roomId : string, message:any){
    users.forEach(user =>{
        if(user.roomId === roomId){
            user.ws.send(JSON.stringify(message))
        }
    })
}

function getUser(ws: any, roomId: string) {
  return users.find(u => u.ws === ws && u.roomId === roomId);
}

let setAdmin = 1; 

Bun.serve({
    fetch(req, server){
        if(server.upgrade(req)){
            return 
        }
        return new Response("Upgrade failed", {status : 500})
    },
    port : 8082,
    websocket :{
        open (ws){
            ws.send("user connected successfully")
        },

        message(ws, message : string){
            const data : Data = JSON.parse(message)
            if(data.type === "join_room"){
                const userExist = users.find(u => u.name ==data.name && u.roomId == data.roomId) ?? null
                if(userExist){
                    ws.send("user already exist in same room")
                    return 
                }
                const isFirstUser = users.filter(u => u.roomId === data.roomId).length === 0;
                users.push({
                    isAdmin : isFirstUser,
                    name : data.name,
                    roomId : data.roomId,
                    ws : ws
                })
                
                ws.send(isFirstUser ? "Admin created" : "user joined room")

                // sycing usr to the room
                const room = rooms.get(data.roomId)
                if(room){
                    ws.send(JSON.stringify({
                        type : "sync",
                        ...room
                    }))
                }
                return 
            }
            if(data.type === "play_song"){
                const user = getUser(ws, data.roomId)
                if(!user?.isAdmin){
                    ws.send("only admin can control ")
                    return 
                }

                const roomState : Room = {
                    songUrl : data.songUrl,
                    isPlaying : true,
                    startedAt : Date.now()
                }
                
                rooms.set(data.roomId, roomState)
                
                broadcastToRoom(data.roomId, {
                    type : "play_song",
                    ...roomState
                })
                return 
            }

            if(data.type === "pause_song"){
                
                const user = getUser(ws,data.roomId)

                if(!user?.isAdmin){
                    ws.send("only admin can control ")
                    return 
                }
                const room = rooms.get(data.roomId)
                if(!room){
                    console.log("this room doesn't exist anymore")
                    return
                }
                room.isPlaying = false
                room.pausedAt = Date.now()  
                broadcastToRoom(data.roomId, {
                    type : "pause_song",
                    pausedAt : room.pausedAt
                })
                return 
            }

            if(data.type === "resume_song"){
                
                const user = getUser(ws,data.roomId)
                if(!user?.isAdmin){
                    ws.send("only admin can control ")
                    return 
                }
                const room = rooms.get(data.roomId)
                if(!room) return 
                const pauseDuration = Date.now() - (room.pausedAt || Date.now())
                
                room.isPlaying = true
                room.startedAt += pauseDuration

                broadcastToRoom(data.roomId, {
                    type : "resume_song",
                    startedAt : room.startedAt
                })

                return 
            }
            
        },
        
        close(ws, code, message){
            ws.send("socket disconnected")
            console.log("server closed")
        }

    }
})