import { prisma } from "@repo/db/prisma";
import { Router } from "express";
import { userMiddleware } from "../middlewares/userMiddleware";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../types";

export const spaceRouter=Router()
interface AuthenticatedRequest extends Request {
    userId: string;
}
spaceRouter.post("/",userMiddleware,async(req:AuthenticatedRequest,res:any)=>{
    const parsedData=CreateSpaceSchema.safeParse(req.body) 
    if(!parsedData.success){
        res.status(400).json({msg:"Validation error"})
        return
    }
    try{    if(!parsedData.data?.mapId){   
        const space=await prisma.space.create({
        data:{
    name:parsedData.data?.name,
    width:parseInt(parsedData.data.dimensions.split("x")[0]),
    height:parseInt(parsedData.data.dimensions.split("x")[1]),
    creatroId:req.userId
    

        }
    }
)
res.json({spaceId: space.id})
return;
}}
catch(e){
    return res.status(403).json({msg:"error in space creation "})
}

    
 
})


spaceRouter.delete("/:spaceId",userMiddleware,async(req:any,res:any)=>{
    const spaceId=req.params.spaceId
    if(!spaceId){
         res.status(403).json({msg:"Please provide spaceId"})
         return
    }

    const space = await prisma.space.findUnique({
        where: {
            id: req.params.spaceId
        }, select: {
            creatroId: true
        }
    })
    if (!space) {
        res.status(403).json({message: "Space not found"})
        return
    }
    if (space.creatroId !== req.userId) {
        console.log("code should reach here")
        res.status(403).json({message: "Unauthorized"})
        return
    }

   await prisma.space.delete({
        where:{
            id:spaceId
        }
    })
    res.status(200)
})

spaceRouter.get("/all",userMiddleware,async(req:AuthenticatedRequest,res:any)=>{
    const space=await prisma.space.findMany({
        where:{
            creatroId:req.userId
        }
    })
    if(!space){
         res.status(400).json({msg:"Space no found"})
         return
    }
    const spaces=space.map(m=>({
        id:m.id,
        name: m.name,
        thumbnail: m.thumbnail,
        dimensions: `${m.width}x${m.height}`,
    }))
    res.status(200).json({spaces:spaces})
})

spaceRouter.get("/:spaceId",userMiddleware,async(req:any,res:any)=>{
    const spaceId=req.params.spaceId
    if(!spaceId){
        res.status(400).json({msg:"SpaceId please "})
        return
   }
   const space=await prisma.space.findUnique({
    where:{
        id:spaceId
    },
    include: {
        elements: {
            include: {
                element: true
            }
        },
    }

   })

   if (!space) {
    res.status(400).json({message: "Space not found"})
    return
}
res.json({
    "dimensions": `${space.width}x${space.height}`,
    elements: space.elements.map(e => ({
        id: e.id,
        element: {
            id: e.element.id,
            imageUrl: e.element.imageUrl,
            width: e.element.width,
            height: e.element.height,
            static: e.element.static
        },
        x: e.x,
        y: e.y
    })),
})


})

spaceRouter.post("/element",userMiddleware,async(req:any,res:any)=>{
    const parsedData = AddElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const space = await prisma.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatroId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if(req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
        res.status(400).json({message: "Point is outside of the boundary"})
        return
    }

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }
    await prisma.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    res.json({message: "Element added"})

})

spaceRouter.delete("/element",userMiddleware, async (req:AuthenticatedRequest, res:any) => {
    console.log("spaceElement?.space1 ")
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const spaceElement = await prisma.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        }, 
        include: {
            space: true
        }
    })
    console.log(spaceElement?.space)
    console.log("spaceElement?.space")
    if (!spaceElement?.space.creatroId || spaceElement.space.creatroId !== req.userId) {
        res.status(400).json({message: "Unauthorized"})
        return
    }
    await prisma.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({message: "Element deleted"})
})