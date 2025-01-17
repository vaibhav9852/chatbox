import {string, z} from 'zod'

export const createMessageSchema = z.object({
    content : z.string().optional(), 
    senderId : z.string(), 
    recipientId : z.string().optional(),
    groupId : z.string().optional(),  
}) 

export const getMessageSchema = z.object({
    recipientId : z.string().optional()
})

export const getGroupMessageSchema = z.object({
     groupId : z.string().optional()
})
 


 






