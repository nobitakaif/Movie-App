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
                        videoUrl
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

    static async getRoomId({roomName} : {roomName : string}) : Promise<RoomModel.GetRoomIdResponse | RoomModel.GetRoomIdFailed> {
        try{

            const roomId = await prisma.room.findFirst({
                where : {
                    name : roomName 
                },
                select : {
                    id : true
                }
            })
            if(!roomId){
                return {
                    msg : "Room Not Found!"
                }
            }
            const room = await prisma.room.findUnique({
                where : {
                    id : roomId.id
                },
                select :{
                    id : true,
                    name : true,
                    videoUrl : true,
                    createdAt : true,

                    admin :{
                        select : {
                            id : true,
                            name : true
                        }
                    },

                    roomMembers : {
                        select : {
                            joinedAt : true,
                            user : {
                                select : {
                                    id : true,
                                    name : true
                                }
                            }
                        }
                    },
                    state : {
                        select : {
                            isPlaying : true,
                            currentTime : true
                        }
                    }
                },
            })

            if(room){
                return {
                    roomId : room?.id,
                    roomName : room.name,
                    videoUrl : room.videoUrl ?? "URL not provided yet",

                    admin : {
                        adminId : room.admin.id,
                        adminName : room.admin.name
                    },

                    roomMember : room.roomMembers.map((member)=>({
                        id : member.user.id,
                        name : member.user.name,
                        joinedAt : member.joinedAt.toISOString()
                    })),
                    playbackState : {
                        currentTime : room.state?.currentTime ?? 0.0,
                        isPlaying : room.state?.isPlaying ?? false
                    },
                    roomCreatedAt : room.createdAt.toISOString()
                }
            }

            return {
                msg : "room not FOUND!"
            }
            
        }catch(e){
            return {
                msg : "room not FOUND!"
            }
        }
    }
}