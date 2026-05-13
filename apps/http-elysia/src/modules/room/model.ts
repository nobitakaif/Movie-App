import { t } from "elysia";

export namespace RoomModel{
    export const createRoomSchema = t.Object({
        name : t.String({minLength : 4, maxLength : 20}),
        videoUrl : t.Optional(t.String({format: "uri"})),
    })
    export type CreateRoomSchema = typeof createRoomSchema.static
    
    export const  createRoomResponse = t.Object({
        roomId : t.String(),
    })
    export type CreateRoomResponse = typeof createRoomResponse.static

    export const failedRoomCreation = t.Object({
        error : t.Any(),
        msg : t.String()
    })
    export type FailedRoomCreation = typeof failedRoomCreation.static

    export const urlParams = t.Object({
        roomId : t.String()
    })
    export type UrlParams = typeof urlParams.static

    export const getRoomIdResponse = t.Object({
        roomId : t.String(),
        roomName : t.String(),
        videoUrl : t.String(),
        roomCreatedAt : t.String({format : "date-time"}),
        admin : t.Object({
            adminId : t.String(),
            adminName : t.String()
        }),
        roomMember : t.Array(t.Object({
            id : t.String(),
            name : t.String(),
            joinedAt : t.String({format : "date-time"})
        })),
        playbackState : t.Object({
            isPlaying : t.Boolean(),
            currentTime : t.Number()
        })
    }) 
    export type GetRoomIdResponse = typeof getRoomIdResponse.static

    export const getRoomIdFailed = t.Object({
        msg : t.String()
    })
    export type GetRoomIdFailed = typeof getRoomIdFailed.static

    export const joinRoomBody = t.Object({
        roomName : t.String(),
        userId : t.String(),
        adminName : t.String()
    })
    export type JoinRoomBody = typeof joinRoomBody.static
    
    export const joinRoomResponse = t.Object({
        success : t.Boolean({ default : true}),
        msg : t.String(),
        id : t.String()
    })
    export type JoinRoomResponse = typeof joinRoomResponse.static

    export const joinRoomFailed = t.Object({
        success : t.Boolean({ default : false}),
        msg : t.String({})
    })
    export type JoinRoomFailed = typeof joinRoomFailed.static

    export const leaveRoomBody = t.Object({
        roomId : t.String(),
        userId : t.String()
    })
    export type LeaveRoomBody = typeof leaveRoomBody.static

    export const leaveRoomResponse = t.Object({
        success : t.Boolean(),
        msg : t.String()
    })
    export type LeaveRoomResponse = typeof leaveRoomResponse.static
}
