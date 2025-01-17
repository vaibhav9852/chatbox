import { verifyEmail } from 'src/services/userService';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from  '../../redux/features/authentication/authSlice'
import { useDispatch } from 'react-redux';
import { VerifyEmailResponse } from '@/src/types';


const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch()  

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 

    if (!token) { 
      toast.error('Invalid or missing token.', {
        position: "top-right", 
        autoClose: 5000,      
        hideProgressBar: false,
      });                      
      return;                  
    }

    try { 
     
      const data: VerifyEmailResponse = await verifyEmail(token); 
    
      if (data?.success) {

            // dispatch(login(data?.token)) 
                  localStorage.setItem('token', JSON.stringify(data.token));
                  dispatch(login({token : data.token , user:data}))
        localStorage.setItem('user', JSON.stringify(data?.data));
        localStorage.setItem('token', JSON.stringify(data?.token));
   
        toast.success('Email verified successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });

       navigate('/chat'); 
      } else {
        toast.error('Something went wrong while verifying email. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    } catch (error) {

      toast.error('Something went wrong while verifying email. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        type="submit"
        onClick={handleSubmit}
        className="w-64 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Verify Email
      </button>
    </div>
  );
};

export default VerifyEmail;  

