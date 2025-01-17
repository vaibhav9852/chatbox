import React, { useCallback, useEffect, useState } from 'react';
// import { URL } from '../../config/apiConfig';  
import { createGroup, getUsers } from '../../services/groupService';
import {  Member } from 'src/types';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Rootstate } from 'src/redux/store';


const CreateGroup = () => { 
  const [groupName, setGroupName] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [addedMembers,setAddedMembers] = useState<string[]>([])
  
  const {adminId} = useParams()  
  // const token = useSelector((state : Rootstate) => state.auth.token )
  const navigate = useNavigate()  
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value); 
  }; 


  // const handleAddMember = (id : string) => {
  //   setAddedMembers([...addedMembers,id])
  // }; 


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName || addedMembers.length === 0) {
      toast.error('Group name and members are required.',{
         position:"top-right",
         autoClose : 5000,
         hideProgressBar : false
      })
      return;
    }
    

    try {
     await  createGroup({name : groupName , adminId , members : addedMembers}) 
      toast.success('Group created successfully!',{
        position : 'top-right'
      })
      setGroupName('');
      setMembers([]);
      navigate('/chat')
    } catch (err) {
      toast.error('Failed to create group. Please try again.',{
        position : 'top-right',
        autoClose : 5000,
        hideProgressBar : false
      })
    }
  };

  // const fetchUsers =  async () =>{
  //    try{
  //    let {data} : any = await getUsers()      
  //   const filterMemeber = data.data.filter((member:Member) => member.id !== adminId) 
  //    setMembers(filterMemeber)    
  //    }catch(error){
  //      toast.error('Error while fetch user',{ 
  //       position : "top-right",
  //       autoClose : 5000,
  //       hideProgressBar:false
  //      })
  //    }
  // } 

  const fetchUsers = useCallback(async () => {
    try {
      const { data }: any = await getUsers();
      const filterMemeber = data.data.filter((member: Member) => member.id !== adminId);
      setMembers(filterMemeber);
    } catch (error) {
      toast.error('Error while fetching users', { 
        position: "top-right", 
        autoClose: 5000, 
        hideProgressBar: false,
      });
    }
  }, [adminId]); 

  const handleCheckChange = (event : React.ChangeEvent<HTMLInputElement>) =>{
    const { value, checked } = event.target;    
     if(checked){
        setAddedMembers([...addedMembers,value])
     }else{
       let filterMember = addedMembers.filter((item) => item !== value)
       setAddedMembers(filterMember)   
     } 
  } 
 
   useEffect(()=>{
     fetchUsers()
   },[fetchUsers])  
                 
  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Create New Group</h2>

      <form onSubmit={handleSubmit}>
  
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-lg font-medium mb-2">Group Name</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={handleGroupNameChange}
            placeholder="Enter group name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

    
        <div className="mb-4">
          <label htmlFor="members" className="block text-lg font-medium mb-2">Members</label>
          <div className="flex space-x-2">
          
          </div>
          <ul className="mt-2 space-y-1">
            {members.map((member,ind) => (
              <li key={ind} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{member.name}</span>
                <input type="checkbox" value={member.id}  name={member.id} onChange={(e) => handleCheckChange(e)} />
              </li>
            ))}
          </ul> 
        </div>

      
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Group
          </button>
         
        </div> 
      </form> 
    </div>
  );
};

export default CreateGroup; 

