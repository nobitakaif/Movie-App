import jwt from "@elysiajs/jwt";
import Elysia, { status } from "elysia";
import { AuthContext } from "../types/context";


export const authMiddleware = new Elysia()
    .use(
        jwt({
            name : "jwt",
            secret : process.env.JWT_SECREt!
        })
    )
    .derive(async({cookie : {auth}, jwt, status})=>{
        if(!auth?.value){
            return status(401, {
                error : "UNAUTHORIZED"
            })
        }

        const decodedToken = await jwt.verify(auth.value as string)
        console.log("decoded token -> ",decodedToken)
        if(!decodedToken || typeof decodedToken.sub !== "string"){
            return status(403, {
                msg : "invalid token!"
            })
        }
        console.log(decodedToken.sub)
        return {
            userId : decodedToken.sub
        }
    })