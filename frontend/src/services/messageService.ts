// import axios from "axios" 
import axiosInstance from "../config/api"

export const sendMessage = async (formData : FormData ) =>{
  let  response = await axiosInstance.post(`/message`, 
    formData,     
    {
      headers: { 
        "Content-Type": "multipart/form-data" ,
      }, }  
  );  
  return response.data    
}
  
export const fetchMessages = async (id:string) =>{ 
  if(id){
 let {data} =  await  axiosInstance.get(`/message/${id}`)  
 return data
  } 
}


