import prisma from '../config/prisma';
import { UserData } from '../types';
import { hashPassword } from '../utils/auth.util';


export const createUser = async ({name, email, password  ,avatar }: UserData) => {
  const hashedPassword  = await hashPassword(password);
  return await prisma.user.create({ data : { name , email, password : hashedPassword , avatar  }}); 
};  
 
 export const findOne = async (myData : object) => {
   return await prisma.user.findFirst({where: myData}) 
 }  



export const updateUser = async (id:string, newData: object) =>{
  return await prisma.user.update({
    where : { id  }, 
    data : newData 
  })
}


 
