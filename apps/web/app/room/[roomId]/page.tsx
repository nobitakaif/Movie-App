"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast, useSonner } from "sonner"

export default function Page() {

    const params = useSearchParams()

    const [socket, setSocket] = useState<WebSocket | null>(null)

    const videoRef = useRef<HTMLVideoElement | null>(null)

    

    useEffect(() => {

        const token = params.get("token")
        const roomId = params.get("roomId")
        console.log(token , roomId)        
        if (!token || !roomId) return

        const ws = new WebSocket(
            `ws://localhost:8888?token=${token}&roomId=${roomId}`
        )
        ws.onopen = () => {
            alert("socket connected")
        }

        ws.onmessage = (event) => {

            const data = JSON.parse(event.data)

              if (!videoRef.current) return
            // request to admin
            if (data.type === "PLAY_REQUEST") {

                const approve = confirm(`${data.from} wants to play the video`)

                if (approve) {

                    ws.send(JSON.stringify({
                        type: "PLAY",
                        currentTime: videoRef.current?.currentTime
                    }))
                }
            }

            
            if (data.type === "PLAY") {

                videoRef.current.currentTime = data.currentTime

                const playPromise = videoRef.current.play()

                if (playPromise) {
                    playPromise.catch(() => {
                        console.log("Autoplay blocked")
                    })
                }

                return
            }

            if (data.type === "ERROR") {
                alert(data.message)
            }
        }

        ws.onclose = () => {
            console.log("socket disconnected")
        }

        setSocket(ws)

        return () => {
            ws.close()
        }

    }, [])

    // admin clicks play button
    function handlePlay() {
        
        if (!socket || !videoRef.current) return
        console.log(videoRef.current.currentTime)
        
        
        socket.send(JSON.stringify({
            type: "PLAY",
            currentTime: videoRef.current.currentTime
        }))
    }

    return (
        <div>

            <button onClick={handlePlay}>
                Play
            </button>

            <video
                ref={videoRef}
                width={800}
                controls
            >
                <source src="/test.mp4" />
            </video>

        </div>
    )
}