import {string, z} from 'zod'

export const userSignupSchema = z.object({
    name : z.string().min(4),
    email : z.string().email(),
    password : z.string().min(8),
    avatar : z.string().optional()
})

export const userSigninSchema = z.object({
   email : z.string().email(),
   password : z.string().min(8)
})

export const getUserSchema = z.object({
    id: z.string()
}) 

// router.post('/forgot-password', forgotPassword)    
 
// router.post('/reset-password/:token' , resetPassword) 

export const forgotPasswordSchema = z.object({
    email : z.string()
})

export const resetPasswordSchema = z.object({
    password : z.string() 
}) 