import { Request, Response } from "express"
import { SignUpSchema } from "../types"

export const SignUp=async(req:Request,res:Response)=>{
const parsedData=SignUpSchema.safeParse(req.body)
console.log(parsedData)
if(!parsedData){
    return  res.status(400).json({msg:"Validataion err"})
    
}
const create=await prisma

}