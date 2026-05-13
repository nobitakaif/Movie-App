import jwt from "jsonwebtoken"

export function jwtVerify({token} : {token : string}){
    
    try{
        const isVerified = jwt.verify(token, process.env.JWT_SECRET!)
        if(!isVerified.sub && isVerified){
            return undefined
        }
        return {
            userId : isVerified.sub as string
        }
    }catch(e){
        return undefined
    }
} 