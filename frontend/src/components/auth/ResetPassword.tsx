import { resetPassword } from 'src/services/userService';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { isValidPassword } from 'src/utils/validation';
import { ResetPasswordResponse } from '@/src/types';


const ResetPassword: React.FC = () => {

  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>('');  

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid or missing token.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
      return;
    }else if(!isValidPassword(password)){
      setPassword('')
          toast.error('Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.',{
            position : "top-right",
            autoClose : 5000,
            hideProgressBar : false 
          })
          return
    }

    try {
  
      const data: ResetPasswordResponse = await resetPassword(token,{password})    

      if (data.success) { 
        toast.success('Your password has been reset successfully!', {
          position: "top-right",
          autoClose: 5000, 
          hideProgressBar: false,
        });
        setPassword('');
        navigate('/login');
      } else {
        toast.error('Something went wrong while resetting your password. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
 
      toast.error('Something went wrong while resetting your password. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false, 
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold my-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your new password"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Reset Password
        </button> 
      </form>
    </div>
  );
};

export default ResetPassword;   
