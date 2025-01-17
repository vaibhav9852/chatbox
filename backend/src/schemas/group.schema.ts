import {string, z} from 'zod'

export const groupMessageSchema = z.object({
    name : z.string(),
    groupId : z.string().email(),
    senderId : z.string().min(8),
    members : z.string().array(), 
    messages : z.object({}).array() 
}) 



export const groupSchema = z.object({
  name: z.string(), 
  description: z.string().optional(), // Optional description
  adminId: z.string(), 
  admin: z.object({ 
    id: z.string(),
    
  }),
  members: z.array(z.string()), 
});





