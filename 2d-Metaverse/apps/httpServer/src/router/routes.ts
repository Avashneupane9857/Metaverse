import { Router } from "express";
import { userRouter } from "./userRouter";
import { spaceRouter } from "./spaceRouter";
import { adminRouter } from "./adminRouter";
import { SignUp } from "../controllers/SignUp";
import { SignIn } from "../controllers/SignIn";
import { GetAvatars } from "../controllers/GetAvatars";
import { Element } from "../controllers/Elements";

export const routes = Router();

routes.post("/signup",SignUp);

routes.post("/signin",SignIn)

routes.get("/avatars",GetAvatars)

routes.get("/elements",Element)








routes.use("/user",userRouter)
routes.use("/space",spaceRouter)
routes.use("/admin",adminRouter)












