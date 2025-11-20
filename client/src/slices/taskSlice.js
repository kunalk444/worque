import { createSlice } from "@reduxjs/toolkit";
const taskSlice=createSlice({
    name:"tasks",
    initialState:{
        tasks:{}
    },
    reducers:{
        saveTasksInRedux:(state,action)=>{
            state.tasks=action.payload;
        }
    }
})
export default taskSlice.reducer;
export const {saveTasksInRedux}=taskSlice.actions;