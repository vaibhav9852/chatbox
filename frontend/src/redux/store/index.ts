import { configureStore } from "@reduxjs/toolkit";
 import authReducer from '../features/authentication/authSlice'
 import chatReducer from '../features/chat/chatSlice'
const store = configureStore({
    reducer:{
         auth: authReducer,
         chat: chatReducer
    }
})

export type Rootstate = ReturnType< typeof store.getState >
 
export type  AppDispatch = typeof store.dispatch

export default store;   