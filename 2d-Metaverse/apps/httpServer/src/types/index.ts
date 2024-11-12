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
  elementId: z.string().min(1),  
  spaceId: z.string().min(1),   
  x: z.number().min(0),         
  y: z.number().min(0),    
});
export const CreateElementSchema=z.object({
  imageUrl:z.string(),
  width:z.number(),
  height:z.number(),
  static:z.boolean()
})
export const UpdateElementSchema = z.object({
  imageUrl: z.string(),
})

export const CreateAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
})

export const CreateMapSchema = z.object({
  thumbnail: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  name: z.string(),
  defaultElements: z.array(z.object({
      elementId: z.string(),
      x: z.number(),  
      y: z.number(),
  }))
})
