
import prisma from "../config/prisma";
import { GroupData } from "../types";


export const createNewGroup = async ({ name, adminId, members }: GroupData) => {

  return await prisma.group.create({
    data: {
      name,
      adminId,
      members: {
        create: [
          ...members.map((id) => ({
            userId : id,
          })),
          {
            userId: adminId, // Ensure the admin is also added as a member
          },
        ],
      },
    },
    include: {
      members: {
        include: {
          user: true, // Fetch user details of members
        },
      },
    },
  });
};


export const getAllGroup = async (userId : string) =>{


  const groups =  await prisma.groupMember.findMany({
    where : {userId},
    include : {group : {include : { admin : true , members : { include : { user : true}}}}}
  })
return groups.map((groupMember) => groupMember.group )
} 


export const getGroupDeatils = async (groupId : string) =>{
    return await prisma.group.findFirst({
        where :{
            id :  groupId
        },
        include : {
            members : true
        }
    })
}

export const exitFromGroup = async (userId : string , groupId: string) =>{
    const groupMember = await prisma.groupMember.findFirst({
      where : {userId , groupId}
    })

    if(!groupMember){
      throw new Error('You are not a member of this group')
    }

    await prisma.groupMember.update({
      where : { id : groupMember.id},
      data : {active : false , exitedAt : new Date()}  
    })
 return { message: 'You have exited the group'}
}



export const deleteGroupService = async (userId: string, groupId: string) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { admin: true },
  });


  if (!group) {
    throw new Error('Group not found');
  }

  if (group.adminId === userId) { 
    await prisma.group.delete({
      where: { id: groupId },
    });

    return { message: 'Group has been deleted permanently' };
  } else {
   
    const groupMember = await prisma.groupMember.findFirst({
      where: { groupId, userId },
    });

    if (!groupMember) {
      console.error('User is not a member of the group');
      throw new Error('You are not a member of this group');
    }

 
    await prisma.groupMember.delete({
      where: { id: groupMember.id },
    });
    
    return { message: 'You have been removed from the group' };  
  } 
};

