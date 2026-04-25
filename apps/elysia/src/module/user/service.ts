import { authClient } from "../../better-auth/auth";


export abstract class UserService {
    
    static async signIn(){
        const response = await authClient.signIn.social({
            provider : "google"
        })
        
        console.log("data recieved -> ",response.data)
        return response.data?.redirect
    }

}