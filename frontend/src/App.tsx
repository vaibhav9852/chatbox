import React from "react";
import { Routes,Route } from "react-router-dom"; 
import { ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css'; 
import Login from "./components/auth/Login"; 
import Signup from "./components/auth/Signup";
import CreateGroup from "./components/group/CreateGroup"; 
import Navbar from "./components/layout/Navbar";
import ChatBox from "./components/chat/ChatBox";
import VerifyEmail from "./components/auth/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Profile from "./components/user/Profile";
// import EditProfile from "./components/user/EditProfile";
import PublicRoute from "./components/routing/PublicRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import TokenManager from "./components/auth/TokenManager";


function App() { 
       
 
  return(
    <>
    <TokenManager />
   <Navbar /> 
    <Routes>
    <Route path='/signup' element={<PublicRoute element={<Signup />} /> } /> 
    <Route path='/verify-email/:token' element={<VerifyEmail />} />
      <Route path='/' element={<PublicRoute element={<Login />} />} /> 
      <Route path='/login' element={ <Login /> } /> 
      <Route path="/forgot-password" element= { <ForgotPassword />} />   
      <Route path="/reset-password/:token" element= { <ResetPassword />} /> 
      <Route path="/chat"  element={ <ProtectedRoute element={<ChatBox />} />} />   
      <Route path="/profile/:id"  element={ <ProtectedRoute element={<Profile />} />} />   
      {/* <Route path="/update-profile"  element={<ProtectedRoute element={ <EditProfile />} />} />  */}
      <Route path="/create-group/:adminId" element={ <ProtectedRoute element={ <CreateGroup />} />} />  
    </Routes>
  
    <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </> 
  )
}

export default App;

