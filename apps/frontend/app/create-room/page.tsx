"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
    const router = useRouter()
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-80 h-48 rounded-2xl overflow-hidden">
        
        {/* Card Content */}
        <div className="absolute inset-[1px] flex-col gap-4 bg-zinc-900 rounded-2xl z-10 flex items-center justify-center text-white text-xl font-semibold p-4">
            <Input placeholder="Enter room name" className="bg-zinc-800 text-white w-full" />
            <Input placeholder="Enter room password" className="bg-zinc-800 text-white w-full" />
          <Button className="bg-white text-black px-9.5 text-lg cursor-pointer font-semibold">Create Room</Button>
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-md"
          style={{
            background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
