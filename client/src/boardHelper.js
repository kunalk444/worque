export const loadSavedTasks=async(email)=>{
    const server=await fetch("http://localhost/5000/tasks/preloadtasks",{
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({email}),
        credentials:'include',
    });
    const res=await server.json();
    if(!res.success)return null;
    

}