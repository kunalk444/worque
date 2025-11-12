export const loadState=()=>{
    try{
        const persistedDataString=localStorage.getItem("persistedState");
        if(persistedDataString==null)return undefined;
        const persistedData=JSON.parse(persistedDataString);
        const timestamp=persistedData.user.timestamp;
        if((timestamp+(24*3600*1000))<Date.now())return {...persistedData,user:{}};
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

