import store from "./src/redux/store";
import { saveData } from "./src/slices/userSlice";

export const loadState=()=>{
    try{
         
        (async()=>
            {
                const res=await fetch("http://localhost:5000/user/userauth",{
                    method:'POST',
                    credentials:'include',
                    headers:{
                    'Content-type':'application/json',
                    }
                });
                const userData=await res.json();
                const {uname,email,id}=userData.user;
                if(userData.success)store.dispatch(saveData({uname,email,id}));
            }
        )();
        const persistedDataString=localStorage.getItem("persistedState");
        if(persistedDataString==null)return undefined;
        const persistedData=JSON.parse(persistedDataString);
        return persistedData;
    }catch{
        console.warn("failed to fetch persisted data!");
    }
}
export const saveState=(data)=>{
    try{
        const strData=JSON.stringify(data);
        localStorage.setItem("persistedState",strData);
    }
    catch{
        console.warn("failed to store state!");
    }
}

