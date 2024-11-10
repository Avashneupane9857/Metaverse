import { SignUpSchema } from "../types"
import { prisma } from "@repo/db/prisma"
import bcrypt from "bcrypt"

export const SignUp = async (req: any, res: any) => {
  const parsedData = SignUpSchema.safeParse(req.body)
  
  if (!parsedData.success) {
    return res.status(400).json({ msg: "Validation error" })
  }

  try {
   
    const check = await prisma.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    })

    if (check) {
  
      return res.status(400).json({ msg: "User already signed up" })
    }


    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)


    const createUser = await prisma.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type,
      },
    })

    res.status(200).json({ userId: createUser.id })
    return
  } catch (e) {
    console.log("Error in signup", e)
    return res.status(500).json({
      msg: "Error in signup",
    })
  }
}
