import { prisma } from '@repo/db/prisma';
import { Request, Router } from 'express';
import { userMiddleware } from '../middlewares/userMiddleware';
import { metadataSchema } from '../types';


interface AuthenticatedRequest extends Request {
    userId: string;
}
export const userRouter=Router()
userRouter.post("/metadata", userMiddleware, async (req: AuthenticatedRequest, res:any) => {
    try {
        const parsedData = metadataSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(403).json({
                msg: "Validation failed",
                errors: parsedData.error.errors
            });
        }
        const check = await prisma.avatar.findUnique({
            where: {
              id: parsedData.data.avatarId,
            },
          });
          if (!check) {
            return res.status(400).json({
              message: "no such avatar found",
            });
          }
      
        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: {
                avatarId: parsedData.data.avatarId
            }
        });

        return res.status(200).json({
            msg: "Metadata updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user metadata:", error);
        return res.status(403).json({
            msg: "Failed to update metadata"
        });
    }
});


userRouter.get("/metadata/bulk", async (req, res) => {
try{
    const ids=req.query.ids as string
    const userIds=ids ? JSON.parse(ids):[]
    const users = await prisma.user.findMany({
        where: {
            id: { in: userIds }
        },
        select: {
            id: true,
            avatar: true
        }
    })
    const avatars = users.map(user => ({
        userId: user.id,
        avatarId: user.avatar?.imageUrl
    }))

    res.status(200).json({ avatars })
}
catch(e){
    res.status(400).json({msg:"error in metadata Bulk"})
}

})