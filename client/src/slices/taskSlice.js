import { createSlice } from "@reduxjs/toolkit";
const taskSlice=createSlice({
    name:"tasks",
    initialState:{
        tasks:{}
    },
    reducers:{
        saveTasksInRedux:(state,action)=>{
            const obj=action.payload;
            state.tasks=obj;
        }
    }
})
export default taskSlice.reducer;
export const {saveTasksInRedux}=taskSlice.actions;