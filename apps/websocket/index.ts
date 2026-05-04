let userCount = 1;
interface dataView {
    type : "join_room" | "chat",
    name? : string,
    roomId? : string,
    message? : string
}
let users :dataView[] = []
Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      console.log("socket is running on port 8081")      
      return;
    }
    
    return new Response("Upgrade failed", { status: 500 });
  },
  port :8081,
  websocket: {
    
    message(ws, message : string){
        
        console.table(users)
        console.log(`\n\nuser ${users[users.length-1]}`)
        const recievedData : dataView = JSON.parse(message)
        if(recievedData.type == "join_room"){
            const alreadyData = users.find(item => item.name === recievedData.name) ?? null
            if(alreadyData){
                ws.send(`user is already joined into roomId ${alreadyData.roomId}`  )
            }
            else{
                users.push(recievedData)
            }
        }
        ws.send(message)
    },
    open(ws){
        console.log(`${userCount} user connectecd`)
        ws.send("socket is connnected")  
    },
    close(ws,code, message){
        console.log(JSON.stringify(ws))
        console.log("socket disconnected")
    }

  },
});