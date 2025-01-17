// import axios from "axios";
import axiosInstance from "../config/api"; 


export const loginUser   = async (credentials: { email: string; password: string }) => {
  const response = await axiosInstance.post(`/auth/login`, credentials); 
  return response.data; 
};

export const signup = async (userData: { name: string; email: string; password: string }) => {
  const response = await axiosInstance.post(`/auth/register`, userData);
  return response.data;
};

export const verifyEmail = async (token : string) =>{
   const response = await axiosInstance.post(`/auth/verify-email/${token}`)
   return response.data
}

export const logout = async () => {
  await axiosInstance.post(`/auth/logout`);
}; 


export const forgotPassword = async (data:object) =>{
 const response =  await axiosInstance.post(`/auth/forgot-password`,data)   
 return response.data 
} 

export const resetPassword = async (token:string,data:object) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`,data) 
  return response.data  
}

export const githubLogin = async () =>{
  const response = await axiosInstance.get(`/auth/github`) 
  return response.data   
}  
 
export const getUsers = async () =>{ 
  return    await axiosInstance.get(`/users`)  
 }  
 
 export const getUser = async (id : string | undefined) =>{
 return await axiosInstance.get(`/users/${id}`)    
 } 

export const editUser =  async (id:string | undefined , formData : FormData) =>{
  const response = await axiosInstance.patch(`/users/${id}`, formData , 
    { 
      headers: { 
       "Content-Type": "multipart/form-data"  
      },
  } 
  ) 
  return response.data     
}




 