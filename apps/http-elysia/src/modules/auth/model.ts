import { t } from "elysia";

export namespace UserModel{
    export const signupSchema = t.Object({
        name : t.String(),
        email : t.String({format : "email"}),
        password : t.String({maxLength : 40, minLength : 8})
    })
    export type SignupSchmea = typeof signupSchema.static 

    export const signupFailed = t.Object({
        msg : t.String()
    })
    export type SignupFailed = typeof signupFailed.static

    export const signupResponse = t.Object({
        id : t.String()
    })
    export type SignupResponse = typeof signupResponse.static

    export const signinSchema = t.Object({
        email : t.String({format : "email"}),
        password : t.String({minLength : 8, maxLength : 40})
    })
    export type SiginSchema = typeof signinSchema.static

    export const signinFailed = t.Object({
        msg : t.String()
    })
    export type SigninFailed = typeof signinFailed.static

    export const signinResponse = t.Object({
        token : t.String()
    })
    export type SigninResponse = typeof signinResponse.static
    
}