Bun.serve({
    port : 3000,
    fetch(req){
        const url = new URL(req.url)
        if(url.pathname.startsWith("/audio")){
            return new Response(Bun.file(`./audio/song.mp3`))
        }
        return new Response("OK")
    }
})