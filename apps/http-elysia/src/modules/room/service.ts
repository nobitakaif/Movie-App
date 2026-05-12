import { prisma } from "@repo/store/client";
import { RoomModel } from "./model";


export abstract class RoomService{
    static async createRoom({ name, videoUrl, adminId} : {name : string, videoUrl: string | undefined , adminId: string }): Promise<RoomModel.CreateRoomResponse | RoomModel.FailedRoomCreation>{
        try{
            const {roomCreation, roomState} = await prisma.$transaction(async (txn) =>{
                const roomCreation = await txn.room.create({
                    data : {
                        name : name,
                        adminId : adminId,
                    }
                })
                console.log("room created -> ", roomCreation.id)
                const roomState = await txn.roomState.create({
                    data : {
                        isPlaying : false,
                        roomId : roomCreation.id
                    }
                })
                console.log("Room state -> ", roomState.id)
                return {
                    roomCreation,
                    roomState
                }
            })
            return {
                roomId : roomCreation.id
            }
        }catch(e:any){
            return {
                error : e,
                msg : "Failed room creation!"

            }
        }
    }
}