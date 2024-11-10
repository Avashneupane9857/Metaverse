import dotenv   from "dotenv"
import express from "express"
import {routes} from "./router/routes"
dotenv.config();
const app=express()
const port =process.env.PORT
app.use(express.json())
app.get("/",(req,res)=>{
    res.json({msg:"Server is healthy"})
})
app.use("/api/v1",routes)
app.listen(port,()=>{
    console.log(`Server is listening to port ${port}`)
})