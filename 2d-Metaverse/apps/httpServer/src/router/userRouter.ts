import { Router } from "express";
import {  metadataSchema } from "src/types";

export const userRouter=Router()

userRouter.post("/metadata",(req,res)=>{
    const parsedData=metadataSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(403).json({
            msg:"Validation failed"
        })
    }
    
})
userRouter.get("/metadata/bulk")
