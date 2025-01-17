import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchMessages } from "src/services/messageService"
import { MessageProps } from "src/types"
// import Loading from "../common/Loading"
import {Messgae} from "src/types/index"
import { useSelector } from "react-redux" 
import { Rootstate } from "src/redux/store"  
import ShowMedia from "../common/ShowMedia"    
import socket from "src/config/socket"
import { fetchGroupMessage } from "src/services/groupService"  
// import { AxiosResponse } from "axios"  
 
 
const Message : React.FC<MessageProps>  = ({item}) => {      
     const [messages , setMessages] = useState<Messgae[]>([]) 
   //  const queryClient = useQueryClient();

    const loginUser = useSelector((state : Rootstate) => state.auth.loginUser )  
    const selectedItem = useSelector((state: Rootstate) => state.chat.selectedItem )

    const {data } = useQuery({
        queryKey:["messages",item.id],  
        queryFn :() => fetchMessages(item.id),   
        enabled : !!item.id,  
         initialData : [] 
    })         
             
    const {data : groupData } = useQuery({
      queryKey:["groupMessages",item.id], 
      queryFn : () => fetchGroupMessage(item.id),
      enabled : !!item.id,    
    }) 

         
  useEffect(() => { 
    if (item.adminId) {
      socket.emit("joinRoom", item.id); 
    } else{ 
     socket.emit('login',item.id) 
    }
  }, [item]);   
                    
  useEffect(() => { 
    if (!selectedItem) return;
    const handleNewMessage = (newMessage: Messgae) => {   
      const isGroupMessage = item.adminId && newMessage?.groupId === item.id; 
      const isDirectMessage = !selectedItem?.adminId && (newMessage?.recipientId === selectedItem?.id || newMessage?.senderId === selectedItem?.id);
   
       if(isGroupMessage && item.members) { 
        const user = selectedItem?.members.find((user) => user.userId === loginUser.id);
      
           if(user?.active === false){
            return 
           }
             // setMessages((prev) => [...prev, newMessage]);  
       }         
      if (newMessage && (isGroupMessage || isDirectMessage)) {  
        setMessages((prev) => [...prev, newMessage]); 
      }  
    }; 
       
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);  
    };
  }, [selectedItem,item.adminId,item.id,item.members,loginUser.id]);  //  change depend


  useEffect(() => {  
    if (data?.data) {
      setMessages(data.data);
    } 
  }, [data]);  
 
  useEffect(() => {
    if (groupData?.data) { 
      setMessages((prev) => {
        const newMessages = groupData.data.data.filter( (msg : any) => !prev.some((existing) => existing.id === msg.id)
        );
        return [...prev, ...newMessages];  
      });  
    } 
  }, [groupData]);        
    
    
     return(     
        <>                                                                                                                           
            { messages.length > 0 &&  messages.map((message:Messgae,index:number) => {
                let fileType = message?.fileUrl?.split(".").reverse()[0] 
                
                 if(loginUser.id !== message.senderId || ( item.adminId && (message.senderId !== loginUser.id) )){ 
                  return (
                    <div className="flex items-end justify-start" key={index}>  
    <div className={`${message.content ? 'bg-gray-200 text-black p-2 rounded-lg max-w-[80%]' : 'h-auto rounded-md'}`}> 
      {message.content}
      {message.fileUrl && fileType && (
        <ShowMedia item={{ type: fileType, fileUrl: message.fileUrl }} /> 
      )} 
    </div>
  </div>
            )
                 }else{ 
               return (  
                <div className="flex items-end justify-end" key={index}>
                <div className={`${message.content ? 'bg-green-500 text-black p-2 rounded-lg max-w-[80%]' : ' h-auto rounded-md'} `}>
                  {message.content}
                  {message.fileUrl && fileType && ( 
                    <ShowMedia   item={{ type: fileType, fileUrl: message.fileUrl }}  />   
                  )}
                </div>
              </div>
            )    
                 } 
            })}     
        </>
    ) 
} 


export default  React.memo(Message)

