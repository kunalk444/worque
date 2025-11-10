import {io} from "socket.io-client";
let socket;

export const initializeSocket=()=>{
    socket=io("http://localhost:5000");
    return socket;
}
export const getSocket=()=>socket;

export const disconnectSocket=()=>{
    if(socket)socket.disconnect();
    socket=null;
}

export const loadChats=async(taskId)=>{
    const res=await fetch("http://localhost:5000/tasks/retrievechats",{
        method:"POST",
        body:JSON.stringify({taskId}),
        credentials:'include',
        headers:{
            'Content-type':'application/json'
        }
    })
    return await res.json();

}

export const getMembers=async(taskId)=>{
    const res=await fetch("http://localhost:5000/tasks/getmembersforchat",{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({taskId})
    });
    return await res.json();
}