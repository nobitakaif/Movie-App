import { prisma } from "@repo/store/client";
import { RoomModel } from "./model";


export abstract class RoomService{
    static async createRoom({ name, videoUrl, adminId} : {name : string, videoUrl: string | undefined , adminId: string }): Promise<RoomModel.CreateRoomResponse | RoomModel.FailedRoomCreation>{
        try{
            const room = await prisma.$transaction(async (txn)=>{
                const roomCreation = await txn.room.create({
                    data : {
                        name,
                        videoUrl,
                        adminId
                    }
                })
                console.log("room created succesfuul -> ", roomCreation.id)
                const roomState = await txn.roomState.create({
                    data : {
                        roomId : roomCreation.id,
                        isPlaying : false,
                        currentTime : 0
                    }
                })
                console.log("room State ->",roomState)
                return roomCreation
            })
            return {
                roomId : room.id,
            }
        }catch(e:any){
            return {
                error : e,
                msg : "Failed room creation!"

            }
        }
    }
}