import { Router } from "express";
import { userRouter } from "./userRouter";
import { spaceRouter } from "./spaceRouter";
import { adminRouter } from "./adminRouter";
import { SignUp } from "../controllers/SignUp";
import { SignIn } from "../controllers/SignIn";

export const routes = Router();

routes.post("/signup",SignUp);

routes.post("/signin",SignIn)

routes.get("/avatars")

routes.post("/space")

routes.delete("/space/:spaceId")

routes.get("/space/all")

routes.get("/space/:spaceId")

routes.get("/elements")








routes.use("/user",userRouter)
routes.use("/space",spaceRouter)
routes.use("/admin",adminRouter)