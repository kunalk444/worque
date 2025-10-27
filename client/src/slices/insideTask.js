import { createSlice } from "@reduxjs/toolkit";

const insideTaskSlice=createSlice({
    name:"insideTask",
    initialState:{
        taskData:{},
    },
    reducers:{
        addData:(state,action)=>{
            state.taskData=action.payload;
        }
    }
});
export default insideTaskSlice.reducer;
export const {addData}=insideTaskSlice.actions;
