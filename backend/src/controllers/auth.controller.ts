import { Request, Response } from 'express';
import  { findOne,  updateUser , createUser } from '../services/auth.service';
import {comparePassword,generateToken,hashPassword,verifyToken} from '../utils/auth.util'
import { sendEmail } from '../utils/sendEmail';
import { upload } from '../utils/cloudinary.util';
import crypto, { verify } from 'crypto'
import { Prisma } from '@prisma/client';

export const signup = async (req: any, res: Response) => {
  const { name, email, password } = req.body;
    let data =  req.files 
    let avatar ;  
    if(data.avatar){ 
      avatar  = await  upload(data.avatar[0].path) 
     }   
console.log('hit signup',name, email, password,avatar)
 const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000" 
  try{
    let findUser = await findOne({email})  //  findUserByEmail(email)

    if(findUser && findUser.verified){
     res.status(401).json({success:false , error: 'User already exist and verify' });
     return;
    }       
    let user  
   if(!findUser){  
user  = await createUser({ name, email, password  ,avatar }); 
   }else{  
    user = findUser 
   }   
  const token = generateToken({ id: user.id }); 
  const updatedUser = await updateUser(user.id,{verifyToken : token})

  const verificationUrl = `${FRONTEND_URL}/verify-email/${token}`; 
  
        const message = `Click the following link to verify your email: ${verificationUrl}`;
        try {
          await sendEmail({
            email: email,
            subject: 'Please verify your email address',
            message, 
          });
        
        res.status(200).json({ success: true, message: 'Signup successful. Please check your email for verification link.' });
        return;
        }catch(error){
          throw new Error("Something wrong while send email")
        }
//  res.status(201).json({success:true,data:{id:user.id,name:user.name,email:user.email,avatar:user.avatar},token });
  }catch(error){
    res.status(500).json({success:false, message:'Internal server error while signup' });
    return;
  }
};


export const login = async (req: Request, res: Response):Promise<String|any> => {
  const { email, password } = req.body;
 try{ 
  const user = await findOne({email}); 
  if (!user || !(await comparePassword(password, user.password)) || !user.verified) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = generateToken({ id: user.id });
  res.json({ success:true, data:{id:user.id,name:user.name,email:user.email,avatar:user.avatar}, token });
  return;
}catch(err){
  res.status(500).json({success:false, message:'Internal server error while login' });
  return;
}
};


export const githubLogin = async (req : Request,res : Response) =>{
    
    let user = req.user as any;
    const token = generateToken({id : user.id}) 
     user = await updateUser(user.id,{ verified : true}) 
  
const userData = encodeURIComponent(JSON.stringify({id:user.id,name:user.name,email:user.email,avatar:user.avatar,token}));
  res.redirect(`http://localhost:3000/login?user=${userData}`);
}

export const verifyEmail = async (req : Request, res : Response)   =>  {
  const { token } = req.params;   
  try {
    const decoded : any  =   verifyToken(token)     
    const user : any = await findOne({id:decoded.id})
  
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    if (user.verified) {
       res.status(400).json({ message: 'Email already verified' });
       return ;
    }
   
    const updatedUser = await updateUser(user.id,{verified : true , verifyToken : '123'})
    const newToken = generateToken({id:user.id})
    res.status(200).json({ success: true, data: { name: user.name, email: user.email, verified: user.verified, id: user.id },token : newToken });
    return ;
  } catch (error) { 
 
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
    return;
  }
};

export const forgotPassword = async (req : Request,res : Response)  :Promise<String|any>   =>{
    let {email} = req.body 
    
    const FRONTEND_URL = process.env.BASE_URL 
    
     try{
        let user = await findOne({email})
        
          if(!user){
           res.status(404).json({success:false,message:'User not found'})
           return ;
          }
       
        const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = new Date( Date.now() + 10 * 60 * 1000 );  // 10 minutes
  await  updateUser(user.id ,{resetPasswordToken,resetPasswordExpire})

 const origin =  process.env.FRONTEND_URL || "http://localhost:3000";
const resetUrl = `${origin}/reset-password/${resetToken}`;
 

  const message = `To reset your password, please click the link: ${resetUrl}`;
           try{
           await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
          });
          res.status(200).json({success:true, message: 'Email send' });
           return ;
        }catch(error){
      
          await  updateUser(user.id ,{resetPasswordToken : null,resetPasswordExpire : null})
            res.status(500).json({success:false,message:'Internal server error while forgot password ',error})
            return;
        }
           
     }catch(error){
        res.status(500).json({success:false,message:'Internal server error while forgot password ',error})
        return;
     }
}


export const resetPassword = async (req : Request,res : Response) : Promise<any> =>{
    try{
        let {token} = req.params   
        let {password} = req.body 
   
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      
        const user = await findOne( {  resetPasswordToken, resetPasswordExpire: { gt: new Date() } })
    
        if (!user) return res.status(400).json({success:false, message: 'Invalid or expired token' });
      
         const hashedPassword = await hashPassword(password) 
         const updatedUser = await updateUser(user.id,{password : hashedPassword , resetPasswordToken:"123" })  
        res.status(200).json({ success:true,message: 'Password reset successfully' });
        return ;
    }catch(error){
   
       res.status(500).json({success:false,message:'Internal server error while forgot password '})
       return ; 
    }
}



