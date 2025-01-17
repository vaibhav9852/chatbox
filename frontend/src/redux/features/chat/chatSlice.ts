import { createSlice } from "@reduxjs/toolkit";

const initialState = {userAndGroupList:[],deleteGroupId:'',exitGroupId:'',selectedItem:{id:'',adminId:'',members:[{active:true,userId:''}]}}

const chatSlice = createSlice({
    name:"chatSlice", 
    initialState : initialState,
    reducers : {
        handleUserAndGroupList(state,action){
           state.userAndGroupList = action.payload
        } ,
        setDeleteGroupId(state,action){
            state.deleteGroupId = action.payload
        },
        setExitGroupId(state,action){
            state.exitGroupId = action.payload 
        },
        handleSelectedItem(state,action){
            state.selectedItem = action.payload 
        }
    }
})  
 
export const { handleUserAndGroupList , setDeleteGroupId ,setExitGroupId , handleSelectedItem } = chatSlice.actions
export default chatSlice.reducer   