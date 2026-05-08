import { prisma } from "@repo/store/client";
import { UserModel } from "./model";


export abstract class UserService {
    static async signup({name, email, password} : UserModel.SignupSchmea) : Promise<UserModel.SignupResponse| UserModel.SignupFailed> {

        try{
            const {id} = await prisma.user.create({
                data : {
                    name : name,
                    email : email,
                    password : await Bun.password.hash(password,{algorithm : "bcrypt", cost : 10})
                }
            })

            return {
                id : id
            }
        }
        catch(e : any){
            return {
                msg : e.message
            }
        }

    }
    static async signin({email, password} : UserModel.SiginSchema) : Promise< {id : string} | UserModel.SigninFailed>{
        const user = await prisma.user.findFirst({
            where : {
                email : email
            }
        })

        
        console.log(user)
        if(user){
            const checkPassword = await Bun.password.verify(password, user.password)
            if(!checkPassword){
                return {
                    msg : "incorrect password"
                }
            }
            return {
                id : user.id
            }
        }
        return {
            msg : "user not found"
        }
    }
}