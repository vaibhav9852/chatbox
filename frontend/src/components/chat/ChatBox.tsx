
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { SelectedItem } from "src/types";  
import List from "./List";  
import Message from "./Message";  
import { deleteGroup, exitGroup   } from "src/services/groupService";
import { sendMessage } from "src/services/messageService"; 
import { useSelector } from "react-redux"; 
import { Rootstate } from "src/redux/store"; 
import { Link, useNavigate } from "react-router-dom";   
import { toast } from "react-toastify"; 
import { useDispatch } from "react-redux";    
import { setDeleteGroupId, setExitGroupId , handleSelectedItem } from "src/redux/features/chat/chatSlice"; 

const ChatBox: React.FC = () => {  
  const [message, setMessage] = useState<string>("");  
  // const [recording, setRecording] = useState<boolean>(false);   
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null); 
  const [file, setFile] = useState<File | null>(null);  
  const [audioUrl,setAudioUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false);   
  const [groupOption , setGroupOption] = useState(false)
  const [groupStatus,setGroupStatus] = useState(false)  
  
  const dropdownRef = useRef<HTMLDivElement>(null) 
   const groupRef = useRef<HTMLDivElement>(null)  
   const messageEndRef = useRef<HTMLDivElement>(null) 
   const loginUser = useSelector((state : Rootstate ) => state.auth.loginUser)   
   const navigate = useNavigate()     
   const dispatch = useDispatch()    
   
   let { status, startRecording, stopRecording} =
    useReactMediaRecorder({ 
      audio: true, 
      onStop: async (blobUrl: string, blob: Blob) => {
       setAudioUrl(blobUrl)
      },   
    });   
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[e.target.files.length-1]);   
    }  
  }; 

  const handleSend = async () => {
    if (!selectedItem) {
      return; 
    }
    if (file && audioUrl) {
      toast.error("You can only send either a file or a recorded audio.");
       resetInputs()
      return;
    }   
  
    const formData = new FormData(); 
    
    if (audioUrl) {
      setIsUploading(true);
      const audioBlob = await fetch(audioUrl).then((res) => res.blob()); 
      formData.append("file", audioBlob, "recording.wav");
    } 

    if (file) { 
      setIsUploading(true);
      formData.append("file", file);
    }

    if (message.trim()) {
      formData.append("content", message);
    } 

    const senderId = loginUser?.id; 
    const recipientId = selectedItem?.id;  
    if(selectedItem.adminId){ 
      formData.append("groupId", selectedItem?.id); 
    }else{
      formData.append("recipientId",recipientId);
    }
    formData.append("senderId", senderId);
   

    try { 
       await  sendMessage(formData)
    } catch (error) {
      
      toast.error("Error while send mesage",{
         position : "top-right",
      })
    } finally {
      resetInputs(); 
      setIsUploading(false); 
    }
  };
      
  const resetInputs = () => {
    setFile(null); 
  setMessage("");
  // setRecording(false);
  setAudioUrl(null)
  }; 

 const handleClickOutside = (event : MouseEvent) =>{
   if(dropdownRef.current &&  !dropdownRef.current.contains(event.target as Node)){
      setDropdownOpen(false) 
   }  
 }

 const handleClickOutsideGroupRef = (event : MouseEvent) =>{
   if(groupRef.current && !groupRef.current.contains(event.target as Node)){
    setGroupOption(false)       
   }
 }  

 const handleExit = async () =>{ 
  try{
     await exitGroup(selectedItem?.id)  
    setGroupOption(false)
    if( selectedItem?.id){ 
      dispatch(setExitGroupId(selectedItem.id))   
      } 
    navigate('/chat')  
    setSelectedItem(null)    
  }catch(error){ 
    toast.error('Error while exit group') 
  }
 }
 
 const handleDelete = async (event : FormEvent)=>{
  event.preventDefault();
  try{
    await deleteGroup(selectedItem?.id)
    setGroupOption(false) 
   if( selectedItem?.id){ 
   dispatch(setDeleteGroupId(selectedItem.id))  
   }
    navigate('/chat')  
    setSelectedItem(null)    
  }catch(error){  
    toast.error('Error while exit group') 
  }
 } 
 
 useEffect(()=> {
    document.addEventListener('mousedown',handleClickOutside)
  return ()=>{
     document.removeEventListener('mousedown',handleClickOutside)
  }
  // setFile(null)
  // setRecording(false) 
},[])

useEffect(()=>{
   document.addEventListener('mousedown',handleClickOutsideGroupRef)
   return () => {
    document.addEventListener('mousedown',handleClickOutsideGroupRef)
   }
},[])

useEffect(()=>{ 
   if(messageEndRef.current){
    messageEndRef.current.scrollIntoView({ behavior: "smooth" }); 
   }
  if(selectedItem?.adminId){
 const users = selectedItem?.members?.filter((user) => user.userId === loginUser?.id)
 if(users && users.length){ 
 setGroupStatus(users[0]?.active)    
 }  
}else{ 
  setGroupStatus(true)   
}  
},[selectedItem?.id, groupStatus,loginUser.id,selectedItem?.adminId,selectedItem?.members])      

useEffect(()=>{
  dispatch(handleSelectedItem(selectedItem)) 
},[selectedItem,dispatch])   
 
  return ( 
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */} 
      <div className="w-1/4 bg-white shadow-md p-4 ">  
      <div className=" flex justify-between my-5"  ref={dropdownRef}>
           <div className=" text-xl font-bold ">Chats</div>   
           <div className=" text-xl font-bold"> 
           
            <button onClick={() => setDropdownOpen((prev) => !prev) }>⋮</button>
            </div>
            {dropdownOpen && ( 
                <div className="absolute  left-24 mt-8 w-40 h-10 bg-white text-gray-700 rounded-md shadow-lg">
                <Link to={`/create-group/${loginUser?.id}`} className="block px-4 py-2 hover:bg-gray-100" >
                    New group  
                  </Link>  
                </div> 
              ) }
           </div> 

        <List onSelect={(item: SelectedItem) => setSelectedItem(item)} />
      </div>  
 
     {/* Chat Area */}      
      <div className="flex flex-col w-3/4">  
        <div className="flex items-center space-x-4 p-4 bg-white shadow-md">
          {selectedItem ? ( 
          
            <> 
              {selectedItem.avatar ? (  
                <img
                  src={selectedItem.avatar}
                  alt={`${selectedItem.name}'s avatar`} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-12 h-10 flex items-center justify-center bg-gray-400 text-white rounded-full">
                  {selectedItem.name.charAt(0).toUpperCase()} 
                </div> 
              )}
              <h2 className="text-lg font-bold">{selectedItem.name}</h2>
           {selectedItem.adminId &&    <div className="flex w-full justify-end  text-2xl font-bold" ref={groupRef}>
           <button onClick={() => setGroupOption((prev) => !prev)}> ⋮ </button>
            </div> }

            {groupOption && (  
                <div className="absolute flex  right-14 p-4  w-52 h-auto bg-white text-gray-700 rounded-md shadow-lg" ref={groupRef} >
                 <div className="flex flex-col ml-2  text-red-500 ">
                  {
             groupStatus === true ?   <button onClick={() => handleExit()}>Exit</button> 
               : <button onClick={(event) => handleDelete(event)}>Delete</button>  
                  } 
                </div>
                </div>  
              ) }                                                          
            </> 
          ) : (
           ""
          )}  
        </div>
         
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto"  ref={messageEndRef}>
          <div className="space-y-4">
         { selectedItem?.id  &&  <Message item={selectedItem}  />  }   
         <div ref={messageEndRef}></div>     
          </div> 
      
        </div>
       
     { ( groupStatus && selectedItem?.id) &&   <div className="p-6 bg-gray-50 rounded-lg shadow-lg flex items-center gap-4">
   <div className="flex items-center gap-3">
    <label className="text-gray-600  text-4xl cursor-pointer hover:text-gray-900 ">
      +
      <input 
      type="file"
      onChange={handleFileChange}   
      accept="audio/*,video/*,image/*"   
      className="hidden" 
    />   
    </label>      
  </div>    
     
  <textarea 
    value={message} 
    onChange={(e) => setMessage(e.target.value)} 
    placeholder="Type your message..."
    rows={1}
    className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex-1"
  /> 
  <div className="flex items-center gap-3">
    {status === "recording" ? (  
      <button 
        onClick={stopRecording}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transition duration-300"
      >
        Stop
      </button>
    ) : ( 
      <button
        onClick={startRecording} 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none transition duration-300"
      >
        🎙️ Record
      </button>
    )}
                 
    <button
      onClick={handleSend}
      disabled={isUploading || (!audioUrl && !file && !message.trim())}
      className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg focus:outline-none hover:bg-green-600 transition duration-300 ${
        isUploading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isUploading ? "Uploading..." : "Send"}
    </button>
  </div>
</div> }  
 {audioUrl && (  
          <audio controls className=" w-56 h-5 m-1"> 
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio> 
        )}    
{file && <p className="ml-2 p-1">{file.name}</p>} 
      </div> 
    </div>
  ); 
}; 
 

export default ChatBox;     

