export async function handlePendingRequests(userId,taskId,type){
    const res=await fetch("http://localhost:5000/user/handlependingrequests",{
        method:'POST',
        body:JSON.stringify({userId,taskId,type}),
        headers:{
            'Content-type':'application/json'
        },
        credentials:'include'
    })
    return await res.json();
}