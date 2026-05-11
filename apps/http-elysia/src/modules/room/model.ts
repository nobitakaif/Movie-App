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
}