import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../slices/userSlice';
import { loadState, saveState } from "../../persisitHelper";
import taskSlice from "../slices/taskSlice";
import insideTaskSlice from "../slices/insideTask";
const persistedData=loadState();

const store=configureStore({
    reducer:{
        user:userSlice,
        tasks:taskSlice,
        insideTask:insideTaskSlice
    },
    preloadedState:persistedData
});

store.subscribe(()=>{
    saveState({
        user:store.getState().user,
        insideTask:store.getState().insideTask,
    });
    //console.log(store.getState().insideTask);
})

export default store;