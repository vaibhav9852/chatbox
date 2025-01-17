
import React, { useState } from "react"
import axiosInstance from "src/config/api"
import { isValidEmail, isValidPassword , isValidName } from "../../utils/validation"
import { toast } from "react-toastify" 
import { Link, useNavigate } from "react-router-dom"
const Signup = () =>{ 
      
    const [user,setUser] = useState({name:'',email:'',password:''}) 
    const [profileImage, setProfileImage] = useState<File | null>(null) ; 
    const [errors, setErrors] = useState({name:'', email:'', password:'' });  
    const [loading,setLoading]  = useState(false) 
    
    const navigate = useNavigate()
     const handleChange = (event : React.ChangeEvent<HTMLInputElement> ) =>{
        setUser({...user,[event.target.name] : event.target.value}) 
        setErrors({...errors,[event.target.name] :""})
     }
       const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) { 
      setProfileImage(event.target.files[0]);
    }
  };  

     const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const  validPassword =  isValidPassword(user.password) 
        const validEmail = isValidEmail(user.email) 
        const validName = isValidName(user.name)
        if(!user.email.trim() || !user.password.trim() || !user.name.trim()){
            toast.error('All fields should be required', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,  
            });
        }else if(!validName){
          setUser({name:'',email:user.email , password : user.password})
         setErrors({name:'Name must be at least 4 characters long',email: errors.email,password:errors.password})
        }
        else if(!validEmail){  
          setUser({name:user.name,email:'',password:user.password})
          setErrors({name:errors.name,email:'Invalid email format.', password : errors.password})      
        }
        else if(!validPassword){ 
          setUser({name:user.name , email:user.email , password :''})
            toast.error('Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
            });
            setErrors({name:errors.name,email:errors.email, password:'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.'})     
        }else{ 
      
        try{
          const formData = new FormData();
                formData.append("name", user.name);
                formData.append("email", user.email);
                formData.append("password", user.password);
          
                if (profileImage) {
                  formData.append("avatar", profileImage);   
                }
            setLoading(true)
          
            let {data} = await axiosInstance.post(`/auth/signup`,formData,{  
              headers: { "Content-Type": "multipart/form-data" }
            }) 
           
            if(data.success){
              toast.success(data.message,{
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar : false
              })
              setUser({name: '',email:'',password:''})
            }
            navigate('/login')
        }catch(error){
          console.log('singup error...',error)
            toast.error('Error while signup',{
              position : 'top-right',
              autoClose : 5000,
              hideProgressBar : false
            })
        }finally{
          setLoading(false)
        }
      
        }
       
        setProfileImage(null)
     }

    return(
        <>

         <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
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
          <div className="mb-6">
             <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
               Profile Image
            </label>
            <input
              type="file"
               name="profileImage"
               id="profileImage"
               onChange={handleImageChange}  
               className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
           </div>
          <button
            type="submit"
            disabled={loading} 
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center justify-between mt-6">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="text-center mt-6">
  <p className="text-sm text-gray-600">
    Already have an account?{" "}
    <Link to="/login" className="text-blue-600 hover:underline">
      Log In
    </Link>
  </p>
</div>

      </div>
    </div>
        </>
    )
}

export default Signup

