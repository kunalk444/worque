/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"userSlice",
    initialState:{
        uname:"",
        email:"",
        isLoggedIn:false,

    },
    reducers:{
        saveData:(state,action)=>{
            const obj=action.payload;
            state.uname=obj.uname;
            state.email=obj.email;
            state.isLoggedIn=true;
        },
        logout:(state,action)=>{
            state.uname="";
            state.isLoggedIn=false;
            state.email="";
            //localStorage.removeItem("persistedState");
        }
    }
});
export default userSlice.reducer;
export const {saveData,logout}=userSlice.actions;