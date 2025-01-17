import prisma from "../config/prisma"

export const findMany = async (userId : string)=>{

    return await prisma.user.findMany({
      where :{
         verified : true ,
         id : {
            not : userId
         } ,
        
      }
    })
   }

// export const findOne = async (myData : object)=>{
//     return await prisma.user.findFirst({
//         where : { myData }
//     })
//    }

   export const updateOne = async (id:string,data:object) => {
    return await prisma.user.update({where: {id} , data : data})
   }     