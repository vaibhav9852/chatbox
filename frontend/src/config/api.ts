import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : 'http://localhost:8000' ,
    headers : {"Content-Type" : "application/json"}
})

axiosInstance.interceptors.request.use((config) => { 
    let token = localStorage.getItem('token') 
    if(token){  
        token = JSON.parse(token)  
        config.headers['Authorization'] = `Bearer ${token}` 
    }

    return config ;
} ,

(error) =>{ 
    return Promise.reject(error)
}
  
)

export default axiosInstance;

