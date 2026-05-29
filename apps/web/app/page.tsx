"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react"
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="h-screen w-full flex justify-center items-center  bg-[#d9d9d9]">
      <Card className="h-[40%] w-[40%] border  shadow-2xl">
        <CardContent className="flex flex-col  gap-5  h-full w-full items-center justify-center ">
          <Button className="h-10 text-lg bg-[#4361ee] px-10 cursor-pointer shadow-2xl" onClick={()=> setShowModal(true)}>
            Create Room
          </Button>
          <Button className="h-10 text-lg bg-[#4361ee] px-12 cursor-pointer shadow-2xl ">
            Join Room
          </Button>
          <Button className="h-10 text-lg bg-[#4361ee] px-16 cursor-pointer shadow-2xl ">
            Login
          </Button>
        </CardContent>
      </Card>
      { showModal && <div className=" z-10 absolute h-screen w-full flex justify-center items-center backdrop-blur-sm" onClick={()=> setShowModal(false)}>

        <Card className="relative border-black shadow-2xl h-[30%] w-[30%]" onClick={(e) => e.stopPropagation()}>
          <CardContent>
            <Input placeholder="enter room name" type="text"/>
            <Input placeholder="enter room password" type="password"/>
          </CardContent>
        </Card>
      </div>}
    </div>
  );
}
