import { prisma } from "@repo/db/prisma"

export const GetAvatars=async(req:any,res:any)=>{
    try{
        const allAvatar=await prisma.avatar.findMany()
        res.status(200).json({
            Avatars:allAvatar
        })

    }catch(e){
        res.status(400).json({msg:"Erro on get all avatars"})
    }
}