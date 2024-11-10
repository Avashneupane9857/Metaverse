import { prisma } from "@repo/db/prisma"

export const Element= async (req:any, res:any) => {
    const elements = await prisma.element.findMany()

    res.json({elements: elements.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
    }))})
}
