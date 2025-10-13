export const loadState=()=>{
    try{
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