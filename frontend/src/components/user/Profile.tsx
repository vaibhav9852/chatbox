import { useSelector } from "react-redux";
import React from "react";
import { Rootstate } from "@/src/redux/store";
// import { useNavigate } from "react-router-dom";

const Profile = () => {         
  const user  = useSelector((state: Rootstate)  => state.auth.loginUser) 
//  const navigate = useNavigate()
  // const handleUpdateProfile = (event : React.MouseEvent<HTMLButtonElement>) =>{
  //       event.preventDefault();
  //      navigate('/update-profile')
  // }   
  console.log('user...',user) 
  return (    
    <> 
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg">
      
        <div className="relative bg-gray-200 h-40">
          <div className="absolute inset-0 bg-gray-800 opacity-30"></div>
          <img
            src={user?.avatar}   
            alt=""   
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
          /> 
        </div>

        <div className="pt-20 pb-6 text-center px-4">
          <h1 className="text-2xl font-semibold text-gray-800">{user?.name}</h1>
          <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
        </div> 
       
        <hr className="border-t border-gray-200" />

        {/* <div className="py-4 px-6 text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button> 
        </div> */}
      </div>
    </div>
    </> 
  );
};

export default Profile;
