/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"userSlice",
    initialState:{
        uname:"",
        email:"",
        isLoggedIn:false,
        id:"",

    },
    reducers:{
        saveData:(state,action)=>{
            const obj=action.payload;
            state.uname=obj.uname;
            state.email=obj.email;
            state.isLoggedIn=true;
            state.id=obj.id;
        },
        logout:(state,action)=>{
            state.uname="";
            state.isLoggedIn=false;
            state.email="";
            state.id="";
        }
    }
});
export default userSlice.reducer;
export const {saveData,logout}=userSlice.actions;