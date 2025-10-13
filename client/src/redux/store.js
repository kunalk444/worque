import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../slices/userSlice';
import { loadState, saveState } from "../../persisitHelper";

const persistedData=loadState();

const store=configureStore({
    reducer:{
        user:userSlice
    },
    preloadedState:persistedData
});

store.subscribe(()=>{
    saveState({
        user:store.getState().user,
    });
})

export default store;