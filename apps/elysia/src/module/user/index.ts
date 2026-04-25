import Elysia from "elysia";
import { UserService } from "./service";

export const userAuth = new Elysia({prefix : "/api/user"})
    .post("/", async function (){
        const isSignin = await UserService.signIn()
        console.log(isSignin)
    },{
        
    })
    