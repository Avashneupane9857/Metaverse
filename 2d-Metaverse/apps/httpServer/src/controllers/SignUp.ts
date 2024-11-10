import { Request, Response } from "express"
import { SignUpSchema } from "../types"
import {prisma} from "@repo/db/prisma"
import bcrypt from "bcrypt"
export const SignUp=async(req:any,res:any)=>{
const parsedData=SignUpSchema.safeParse(req.body)
console.log(parsedData)
if(!parsedData.success){
    return  res.status(400).json({msg:"Validataion err"})
    
}
try
{
const hashedPassword=await bcrypt.hash(parsedData.data.password,10)
const createUser=await prisma.user.create({
    data:{
        username:parsedData.data.username,
        password:hashedPassword,
        role:parsedData.data.type
    }
})
res.status(200).json({userId:createUser.id})
return
}
catch(e){

    console.log("error in signup",e)
    return res.status(403).json({
msg:"Erro in signup"
    })
}

}