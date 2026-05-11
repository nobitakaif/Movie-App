export {}

declare global{
    interface ElysiaContext{
        userId : string
    }
}

export type AuthContext = {
    userId : string 
}