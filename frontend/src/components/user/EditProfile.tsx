import { Rootstate } from "src/redux/store"
import { useSelector } from "react-redux"
import { User } from "src/types" 
import React, { useEffect, useState } from "react" 
import { isValidPassword } from "src/utils/validation"
import { toast } from "react-toastify"
import { editUser } from "src/services/userService" 
 
const EditProfile = () => { 
const [userData,setUserData] = useState<User>({name:"",email:"",password:"",avatar:undefined,id:""}) 
const user   = useSelector((state: Rootstate)  => state.auth.loginUser ) 



 useEffect(() =>{
  if(user) 
  setUserData(user)   
 },[user])  

 
 const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setUserData({ ...userData, [name]: value });
};

const handleFileChange = (e :  React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setUserData({ ...userData, avatar: e.target.files[0] }); 
  } 
 
};

const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
 if(userData.password?.trim() && !isValidPassword(user.password)){
  toast.error('Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.',{ 
    position : "top-right",
    hideProgressBar : false,
    autoClose : 5000
  })
  return
 }
  let formData = new FormData()
  formData.append("name",user.name)
  formData.append("email",user.email)
  formData.append("password",user.password)
  if(user.avatar){
    formData.append("avatar",user.avatar)
  }

  
  try{ 
   let response = await editUser(user.id , formData) 
  }catch(error){
    toast.error('Error while update profile',{  
      position : "top-right", 
      autoClose : 5000, 
      hideProgressBar : false  
    }) 
  }

};

    return ( 
       <> 
        <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
    
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
       </>
    );

   // create one card for update profile with input field name email avatar password 
 
} 
    
export default EditProfile 

