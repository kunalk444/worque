export async function handlePendingRequests(taskId,type){
    const res=await fetch("http://localhost:5000/user/handlependingrequests",{
        method:'POST',
        body:JSON.stringify({taskId,type}),
        headers:{
            'Content-type':'application/json'
        },
        credentials:'include'
    })
    console.log(res);
}