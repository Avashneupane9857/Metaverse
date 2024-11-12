import { prisma } from "@repo/db/prisma";
import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../types";

export const adminRouter = Router();
adminRouter.use(adminMiddleware);


adminRouter.post("/element", async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ msg: "Validation error" });
        return;
    }

    try {
        const element = await prisma.element.create({
            data: {
                
                imageUrl: parsedData.data.imageUrl,
                width: parsedData.data.width,
                height: parsedData.data.height,
                static: parsedData.data.static
            }
        });
        console.log("elemtId is being printed",element.id)
      res.status(200).json( element );
        return
    } catch (error) {
        console.error("Error in posting elements:", error);
        res.status(500).json({ msg: "Error in posting elements" });
    }
});


adminRouter.put("/element/:elementId", async (req, res) => {
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
         res.status(400).json({ message: "Validation failed" });
         return
    }

    try {
      
        const element = await prisma.element.findUnique({
            where: { id: req.params.elementId },
        });

        if (!element) {
             res.status(404).json({ message: "Element not found" });
             console.log("i reached here no elemmet")
             return
        }


        await prisma.element.update({
            where: {
                id: req.params.elementId
            },
            data: {
                imageUrl: parsedData.data.imageUrl
            }
        });

        res.status(200).json({ message: "Element updated" });
    } catch (error) {
        console.error("Failed to update element:", error);
        res.status(500).json({ message: "Failed to update element" });
    }
});



adminRouter.post("/avatar", async (req, res) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
    }

    try {
        const avatar = await prisma.avatar.create({
            data: {
                name: parsedData.data.name,
                imageUrl: parsedData.data.imageUrl
            }
        });
        res.status(200).json({ avatarId: avatar.id });
    } catch (error) {
        console.error("Error creating avatar:", error);
        res.status(500).json({ message: "Failed to create avatar" });
    }
});


adminRouter.post("/map", async (req, res) => {
    const parsedData = CreateMapSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" });
        return;
    }

    try {
        const map = await prisma.map.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                thumbnail: parsedData.data.thumbnail,
                mapElements: {
                    create: parsedData.data.defaultElements.map(e => ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            }
        });

        res.status(200).json({ id: map.id });
    } catch (error) {
        console.error("Error creating map:", error);
        res.status(500).json({ message: "Failed to create map" });
    }
});
