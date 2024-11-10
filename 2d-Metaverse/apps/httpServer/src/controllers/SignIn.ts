import { prisma } from "@repo/db/prisma";
import { SignInSchema } from "../types";
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config(); 
export const SignIn =async(req:any,res:any)=>{
    const secret=process.env.JWT_SECRET
    if (!secret) {
        return res.status(500).json({ msg: "JWT_SECRET is not defined in environment variables." });
      }
    const parsedData=SignInSchema.safeParse(req.body)
if(!parsedData.success){
    res.status(403).json({
        msg:'Erro in validation'
     
    })
    return
}
try{const user=await prisma.user.findUnique({
    where:{
        username:parsedData.data.username
    }
})
if(!user){
    res.status(403).json({
        msg:"User not found"
    })
return
}
const passwordCheck=await bcrypt.compare(parsedData.data.password,user.password)
if(!passwordCheck){
    res.status(403).json({msg:"Passworr is not correct"})
}

const tokens=jwt.sign({username:parsedData.data.username},secret,{ expiresIn: '1h' })
res.status(200).json({token:tokens})
return
}

catch(e){
    console.log("error in signin",e)
    return res.status(403).json({msg:"err in signIn"})
}
 


}