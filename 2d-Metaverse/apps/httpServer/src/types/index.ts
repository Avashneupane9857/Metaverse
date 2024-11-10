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

export const metadataSchema = z.object({
avatarId:z.string()

});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string().optional(),
})

export const DeleteElementSchema = z.object({
  id: z.string(),
})

export const AddElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
})