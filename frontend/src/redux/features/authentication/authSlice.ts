
import { createSlice } from "@reduxjs/toolkit";

let persistedToken = localStorage.getItem('token');
const persistedUser = localStorage.getItem('user');
const persistUser = persistedUser ? JSON.parse(persistedUser) : { name: "", id: "", avatar: ""  };
const isAuthenticated = persistedToken ? true : false;

const initialState = {
  isAuthenticated: isAuthenticated,
  token: persistedToken,
  loginUser: persistUser,
};
const authSlice = createSlice({ 
   name : 'authentication', 
   initialState : initialState,   
   reducers:{
     login(state,action){
        state.token = action.payload.token
        state.isAuthenticated = true 
        state.loginUser = action.payload.user 
        localStorage.setItem('token',JSON.stringify(action.payload.token))
        localStorage.setItem('user',JSON.stringify(action.payload.user))  
     } ,
     logout : (state) => {
       localStorage.clear()  
       state.isAuthenticated = false 
       state.token = '' 
     } 
    
   }

})

export const {login , logout } = authSlice.actions

export default  authSlice.reducer 



