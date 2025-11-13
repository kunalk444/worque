import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../slices/userSlice';
import { loadState, saveState } from "../../persisitHelper";
import taskSlice from "../slices/taskSlice";
import insideTaskSlice from "../slices/insideTask";
import chatSlice from "../slices/chatSlice";
import notificationSlice from "../slices/notificationSlice"
const persistedData=loadState();

const store=configureStore({
    reducer:{
        user:userSlice,
        tasks:taskSlice,
        insideTask:insideTaskSlice,
        chats:chatSlice,
        notifications:notificationSlice,
        
    },
    preloadedState:persistedData
});

store.subscribe(()=>{
    saveState({
        user:{...store.getState().user,timestamp:Date.now()},
        insideTask:store.getState().insideTask,
        notifications:store.getState().notifications
    });
    //console.log(store.getState().insideTask);
})

export default store;