
type WebSocketType = {
    token: string
}

const server = Bun.serve({
    fetch(req, serve){
        
        if (serve.upgrade(req, {
            data: {
                token: new URL(req.url).searchParams.get("token")!
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
            console.log(ws.data?.token)
        },
        message(ws, message){
            if(message == 'ping'){
                ws.send('pong')
            }
        },
        close(ws){
            ws.send("you're disconnected!")
        }
    }
})

console.log("server is runnin on port : ", server.port)