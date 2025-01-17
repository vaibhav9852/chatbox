
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { isValidEmail, isValidPassword } from "../../utils/validation"
import { toast } from "react-toastify" 

import { Link, useNavigate } from "react-router-dom" 
import {  loginUser } from "src/services/userService"
 import {login} from "../../redux/features/authentication/authSlice"
// import { Rootstate } from "src/redux/store"

const Login = () =>{ 
    const [user,setUser] = useState({email:'',password:''})  
    const [errors, setErrors] = useState({ email: '', password: '' });   
    const [loading,setLoading] = useState(false) 
    
     const dispatch = useDispatch()
     //const isAuthenticated = useSelector((state: Rootstate) => state.auth.isAuthenticated)
     const navigate = useNavigate() 

     const handleChange = (event : React.ChangeEvent<HTMLInputElement> ) =>{
        setUser({...user,[event.target.name] : event.target.value}) 
        setErrors({ ...errors, [event.target.name]: "" });
     }  
               
     useEffect(() => {
       const queryParams = new URLSearchParams(window.location.search); 
       const userData = queryParams.get('user');     
   
       if (userData) {
         const data = JSON.parse(decodeURIComponent(userData))
         if(data.token){
          localStorage.setItem('token', JSON.stringify(data.token));
          dispatch(login({token : data.token , user:data}))
          toast.success('Login successful !',{
            position : 'top-right',
            autoClose : 5000, 
            hideProgressBar : false 
          }) 
            navigate('/chat')   
          
         }   
       }   
     }, [loading , dispatch, navigate]);    
     
      
     const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault() 
      
        const  validPassword =  isValidPassword(user.password)  
        const validEmail = isValidEmail(user.email)    
        if(!user.email.trim() || !user.password.trim()){ 
            toast.error('Email and password should be required', { 
                position: "top-right", 
                autoClose: 5000,
                hideProgressBar: false, 
            }); 
        }else if(!validEmail){
          setUser({email:'' , password : user.password}) 
          setErrors({email:'Invalid email format.', password : errors.password})
        }
        else if(!validPassword){
          setUser({email:user.email , password : ''}) 
            setErrors({email:errors.email,password:'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.'})
        }else{
          setLoading(true) 
        try{     
            let data = await loginUser(user) 
            if(data.success){
              localStorage.setItem('token',JSON.stringify(data.token))  
              dispatch(login({token : data.token , user:data.data})) 
              toast.success('Login successful !',{
                position : 'top-right',
                autoClose : 5000, 
                hideProgressBar : false
              })  
              setUser({email:'',password:''})
              
              navigate('/chat') 
            }  
        }catch(error){ 
         toast.error('Login failed !',{
           position : 'top-right',
           autoClose : 5000, 
           hideProgressBar : false
         }) 
        }finally{
          setLoading(false)  
        }
      
        }
       
        
     }

    //  const handleGithubLogin = async (event: React.FormEvent<HTMLElement>) =>{
    //          event.preventDefault() 
    //          setLoading(true)  
    //    try{ 
    //     //  const data  = 
    //        await  githubLogin()  

    //    }catch(error){ 
    //     toast.error('Oops login failed', {
    //         position: "top-right",
    //         autoClose: 5000,
    //         hideProgressBar: false, 
    //     }); 
    //    }
    //  }

    return(
        <>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-700">Log In</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4"> 
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email 
            </label>
            <input
              type="email" 
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <Link to="/forgot-password"> <p className=" font-semibold text-sm pt-2 mb-4">Forgot password</p></Link>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In 
          </button>
        </form> 
        <div className="flex items-center justify-between mt-6">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <hr className="w-full border-gray-300" />
        </div>
        <button
          className="w-full mt-6 py-2 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <Link to='http://localhost:8000/auth/github'>
          Log In with GitHub 
          </Link>
        </button>
        <div className="text-center mt-6">
  <p className="text-sm text-gray-600">
    Don't have an account?{" "}
    <Link
      to="/signup"
      className="text-blue-600 hover:underline"
    >
      Sign Up
    </Link>
  </p>
</div>

      </div>
    </div>
        </>
    )
}

export default Login 

 