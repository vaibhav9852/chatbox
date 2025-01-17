import {Request , Response} from "express"
import { findMany, updateOne } from "../services/user.service"
import { findOne } from "../services/auth.service"
import { verifyToken } from "../utils/auth.util";
import { upload } from "../utils/cloudinary.util"; 


export const getUsers = async (req : Request,res : Response) =>{ 
   const token : any  = req.headers.authorization?.split(' ')[1];  

    try{                                           
      const user = verifyToken(token) 
       let users = await  findMany(user.id) 
     res.status(200).json({success:true,data:users}) 
     return ; 
    }catch(error){ 
    res.status(500).json({success:false,message:'Internal server error while get users'})
    return;
    } 
 } 

 export const getUser = async (req: Request , res:Response) =>{
   try{ 
      let {id} = req.params  
       let user = await findOne({id}) 
       res.status(200).json({success:true,data:user}) 
       return;
   }catch(error){
     res.status(500).json({success:false,message:'Internal server error while get user'})
     return ;
   }
 } 
  
 export const updateUser = async (req: any,res:Response) =>{
   let {name,email,passsword} = req.body   
   let data =  req.files 
    let avatar ; 
    if(data.avatar){ 
      avatar  = await  upload(data.avatar[0].path) 
     }   
   let {id} = req.params  

   try{      
      let response = await updateOne(id, {name,email,passsword,avatar}) 
   
      res.status(200).json({success:true,data:response})  
      return ;   
   }catch(error){ 
      res.status(500).json({success:false,message:'Internal server error while update user'})
      return ;
   } 
 }

 