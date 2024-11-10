import { Router } from "express";
import { userRouter } from "./userRouter";
import { spaceRouter } from "./spaceRouter";
import { adminRouter } from "./adminRouter";

export const routes = Router();

routes.post("/signup");

routes.post("/signin")

routes.get("/avatars")

routes.post("/space")

routes.delete("/space/:spaceId")

routes.get("/space/all")

routes.get("/space/:spaceId")

routes.get("/elements")








routes.use("/user",userRouter)
routes.use("/space",spaceRouter)
routes.use("/admin",adminRouter)