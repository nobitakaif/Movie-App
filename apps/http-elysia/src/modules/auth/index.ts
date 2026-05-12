import Elysia, { status } from "elysia";
import { UserModel } from "./model";
import { UserService } from "./service";
import jwt from "@elysiajs/jwt";

export const auth = new Elysia({prefix : "auth"})
    .post("/signup", async function ({body}){
        const { name, email, password} = body
        const res = await UserService.signup({name, email, password})
        console.log(res)
        if('id' in res){
            return status(200, {
                id : res.id.toString()
            })
        }
        return status(400, {
            msg : res.msg
        })
    },{
        body : UserModel.signupSchema,
        response : {
            200 : UserModel.signupResponse,
            400 : UserModel.signupFailed
        }
    })
    .use(
        jwt({
           name : "jwt",
           secret : process.env.JWT_SECRET! 
        })
    )
    .post("/signin", async function ({body, jwt, cookie : {auth}}){
        const { email, password } = body
        const  res = await UserService.signin({ email, password })
        
        if('id' in res){
            console.log('user_id -> ', res.id)    
            const token = await jwt.sign({ sub : res.id})
            console.log(token)
            auth.set({
                value : token,
                maxAge : 7 * 86400, // 7 days
                httpOnly : true,
                secure : true
            })
            
            return status(200,{
                token : token
            })
        }
        return status(400, {
            msg : res.msg
        })
    }, {
        body : UserModel.signinSchema,
        response : {
            200 : UserModel.signinResponse,
            400 : UserModel.signinFailed
        }
    })