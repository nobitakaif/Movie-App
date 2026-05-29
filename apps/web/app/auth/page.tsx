
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Page(){
    const [signup, setSignup] = useState(false) 
    return <div className="h-screen w-full flex items-center justify-center gap-5">
        <Card className=" flex flex-col h-[30%] w-[30%] items-center justify-center">
            <CardContent className="flex flex-col">
                {signup && <Input placeholder="enter your name" type="text"/>}
                <input type="text" placeholder="enter your email" className="" />
                <input type="password" placeholder="enter your password" />
            </CardContent>
            <Button className="w-[50%]" variant={'outline'}>{signup ? 'signup' : 'signin'}</Button>
        </Card>
    </div>
}