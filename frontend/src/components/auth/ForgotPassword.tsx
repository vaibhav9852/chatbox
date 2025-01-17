import { forgotPassword } from 'src/services/userService';
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { ForgotPasswordResponse } from 'src/types';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');  
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    try { 
      const data : ForgotPasswordResponse = await forgotPassword({email}) 
      if(data.success) {  
        toast.success('Password reset link sent! Check your email.', {
          position: "top-right", 
          autoClose: 5000,
          hideProgressBar: false,
        });
        navigate('/login');
      }else{
        toast.error('Oops! Something went wrong. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
      setEmail(''); 
    } catch (error) {
      toast.error('Oops! Something went wrong. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
