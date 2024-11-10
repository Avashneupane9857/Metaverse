import jwt from "jsonwebtoken"
export const adminMiddleware=(req:any,res:any,next:any)=>{
    const secret = process.env.JWT_SECRET
    if (!secret) {
        return res.status(403).json({ msg: "Provide JWT SECRET" })
    }

    try {

        const bearer = req.headers["authorization"]
        if (!bearer) {
            return res.status(403).json({
                msg: "No authorization header found"
            })
        }


        const token = bearer.split(" ")[1]
        if (!token) {
            return res.status(403).json({
                msg: "No token provided"
            })
        }

 
        const decoded = jwt.verify(token, secret) as { userId: string, role: string }
        
   
        console.log("Decoded token:", decoded)
        
        if (!decoded.role) {
            return res.status(403).json({
                msg: "Token payload does not contain role"
            })
        }

        if (decoded.role !== "Admin") {
            return res.status(403).json({ message: "Unauthorized" })
        }

        req.userId = decoded.userId
        next()
    } catch (error) {

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ msg: "Invalid token" })
        }
        return res.status(500).json({ msg: "Internal server error" })
    }
    next()
}