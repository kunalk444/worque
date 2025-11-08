import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:"chatSlice",
    initialState:{
        chats:[],
    },
    reducers:{
        saveChatsInRedux:(state,action)=>{
            state.chats=action.payload;
        }
    }
})
export default chatSlice.reducer;
export const {saveChatsInRedux}=chatSlice.actions;