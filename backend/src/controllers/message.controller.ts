import prisma from "../config/prisma";
import {Request , Response} from 'express'
import { createMessage , readAllMessage , readGroupMessage} from '../services/message.service'
import { upload } from "../utils/cloudinary.util";
import { activeUsers, io } from "../app";
import {  verifyToken } from "../utils/auth.util"; 
 

export const addMessage = async (req : any,res : Response) =>{ 
     let {content,senderId,recipientId,groupId}  = req.body
     const token : any = req.headers.authorization?.split(' ')[1];  
     const data = req.files     
   let fileUrl   
   if(data.file){ 
    fileUrl  = await  upload(data.file[0].path)  
   }   
     
   if(!recipientId && !groupId) {
    res.status(400).json({success:false,message:'RecipientId or groupId is required'});
    return ;
   }
     try{ 
      let user =  verifyToken(token)   
      senderId = user.id 
      let message = await createMessage({content,fileUrl,senderId,recipientId,groupId})  
      if (groupId) {       
        io.to(groupId).emit("newMessage", message , groupId); 
      } else {
        const senderSocketId = activeUsers.get(senderId);
        const recipientSocketId = activeUsers.get(recipientId);

        if (senderSocketId) {
          io.to(senderSocketId).emit("newMessage", message ,  senderId); 
        }

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newMessage", message , recipientId); 
        }
      } 
       res.status(201).json({success:true,data:message})  
       return;
     }catch(error){ 
        res.status(500).json({success:false,message:'Internal server error while add message'})
        return ;
     } 
}


export const getMessage = async (req : Request,res : Response) =>{
  const token : any  = req.headers.authorization?.split(' ')[1];  
       const {recipientId} = req.params 
    try{
      const user =  verifyToken(token) 
      const senderId = user.id
      let messages = await readAllMessage(senderId,recipientId)
      res.status(200).json({success:true,data:messages})
      return;  
    }catch(error){
        res.status(500).json({success:false,message:'Internal server error while read message'})
        return; 
    } 
}

export const getGroupMessage = async (req:Request,res :Response) =>{
  const token : any  = req.headers.authorization?.split(' ')[1];   
    const {groupId} = req.params     
    try{
      const user =  verifyToken(token) 
      const userId = user.id  
    const groupMessages = await  readGroupMessage(groupId , userId)    
    res.status(200).json({success:true,data:groupMessages}) 
    return ;
    }catch(error){
        res.status(500).json({success:false,message:'Internal server error while read group message'})
        return ;
    }
} 


