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

    static async getRoomId({roomName, adminName} : {roomName : string, adminName : string}) : Promise<RoomModel.GetRoomIdResponse | RoomModel.GetRoomIdFailed> {
        try{

            const roomId = await prisma.room.findFirst({
                where : {
                    name : roomName,
                    admin : {
                        name : adminName
                    }
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

    static async joinRoom({ roomName, userId, adminName } : RoomModel.JoinRoomBody) : Promise<RoomModel.JoinRoomResponse |  RoomModel.JoinRoomFailed>{
        try{
            const isRoom = await prisma.room.findFirst({
                where : {
                    name : roomName,
                }, 
                select : {
                    admin : {
                        select : {
                            name : true
                        }
                    },
                    id : true
                }
            })
            if(!isRoom){
                return {
                    msg : "Room not Found",
                    success : false
                }
            }
            const userJoin = await prisma.roomMember.create({
                data : {
                    roomId : isRoom.id,
                    userId,
                }
            })

            if(!userJoin){
                return {
                    success : false,
                    msg : "You're already joined"
                }
            }
            
            return {
                success : true,
                msg : "User joined successfully",
                id : userJoin.id
            }
        }catch(e){
            return {
                success : false,
                msg : "Please try again!"
            }
        }
    }

    static async leaveRoom({roomId, userId} : RoomModel.LeaveRoomBody) : Promise<RoomModel.LeaveRoomResponse>{
        try{
            const isLeaved = await prisma.roomMember.delete({
                where : {
                    userId_roomId : {
                        userId, 
                        roomId
                    }
                },
                select : {
                    room : {
                        select : {
                            name : true
                        }
                    },
                    id : true
                }
            }) 
            
            return {
                success : true,
                msg : "You leaved Room successfull from :" + isLeaved.room.name
            }
        
            
        }catch(e){
            return {
                success : false,
                msg : "please try again, you didn't leaved rooom!"
            }
        }
    }
}