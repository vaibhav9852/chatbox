import prisma from "../config/prisma";

 interface MessageData {
     
     content? :  string
     fileUrl? : string
     fileType? : string
     senderId : string 
     groupId? : string
     recipientId? : string
     
 } 

 // create message 
  export  const createMessage = async (data : MessageData) =>{
    return await prisma.message.create({ data })
  }
 
 // read non group message  
 export const readAllMessage = async (senderId : string,recipientId :string ) =>{
    return await prisma.message.findMany({
        where: {
            OR: [
              { senderId: senderId, recipientId },
              { senderId: recipientId, recipientId: senderId },
            ],
          },
          orderBy: { createdAt: 'asc' }, // Order messages by creation time
        
    });
 }

 // read group message 

 export const readGroupMessage = async (groupId : string,userId : string) =>{
    // return await prisma.message.findMany({
    //     where : { groupId  },
    //     orderBy: { createdAt: 'asc' },  
    // })
    
       const groupMember = await prisma.groupMember.findFirst({
    where: { userId, groupId },
    select: { active: true, exitedAt: true },
  });

  if (!groupMember) {
    throw new Error('You are not a member of this group');
  }
  const filterCondition = groupMember?.active
    ? {} 
    : {
        createdAt: {
          lte: groupMember?.exitedAt || new Date(), 
        },
      };
  return await prisma.message.findMany({
    where: {
      groupId,
      ...filterCondition,
    },
    orderBy: { createdAt: 'asc' },  
  });

    
 }  
  
//  export const readGroupMessage = async (groupId : string) => {
//     return await prisma.message.findMany({
//        where : { groupId} ,
//        orderBy : { createAt : 'asc'}
//     })
//  }

 // delete message 

 /*
 import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fetchMessages = async (userId: string, recipientId?: string, groupId?: string) => {
  if (recipientId) {
    // Fetch messages for one-to-one chat
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' }, // Order messages by creation time
    });
  }

  if (groupId) {
    // Fetch messages for a group chat
    return prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' }, // Order messages by creation time
    });
  }

  throw new Error('Invalid query parameters.');
};

 */