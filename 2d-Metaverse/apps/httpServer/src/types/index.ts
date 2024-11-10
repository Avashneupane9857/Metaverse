import {  z } from "zod";


export const SignUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  type: z.enum(["User", "Admin"]),
});


export const SignInSchema = z.object({
  username: z.string(),
  password: z.string(),

});