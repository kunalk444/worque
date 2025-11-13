import { createSlice } from "@reduxjs/toolkit";

const notificationSlice=createSlice({
    name:'notificationSlice',
    initialState:{
        notificationsArray:[]
    },
    reducers:{
        saveNotificationsInRedux:(state,action)=>{
            state.notificationsArray=action.payload;
        }
    }
})
export default notificationSlice.reducer;
export const {saveNotificationsInRedux}=notificationSlice.actions; 