// import axios from "axios"
import axiosInstance from "../config/api"  


export const getUsers = async () =>{     
 return    await axiosInstance.get(`/users`)     
} 
 
export const getUser = async (id : string) =>{ 
return await axiosInstance.get(`/users/${id}`)   
}
 

export const getGroups = async () =>{
return await axiosInstance.get(`/group`)
    
} 

export const createGroup = async (data:object) =>{
    return await axiosInstance.post(`/group/create`,data) 
}

export const exitGroup = async (groupId:string | undefined) =>{
    return await axiosInstance.patch(`/group/${groupId}/exit`)   
}

export const deleteGroup = async (groupId:string | undefined) =>{
    return await axiosInstance.delete(`/group/${groupId}` ) 
}



export const fetchGroupMessage = async (id : string) =>{
 
    let response =  await axiosInstance.get(`/message/group/${id}` )  
    return response    
} 


