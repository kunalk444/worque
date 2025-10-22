
export function addSubTask(str){
    try{
        if(!localStorage.getItem("subtasks")){
            const arr=[];
            localStorage.setItem("subtasks",JSON.stringify(arr));
        }
        const arr=JSON.parse(localStorage.getItem("subtasks"));
        arr.push(str);
        localStorage.setItem("subtasks",JSON.stringify(arr));
        console.log(arr);
        return true;    
    }
    catch{
        console.error("subtask not saved!");
    }
}
export function sendEmail(emailId){
    try{
        if(!localStorage.getItem("emails"))localStorage.setItem("emails",JSON.stringify([]));
        const arr=JSON.parse(localStorage.getItem("emails"));
        arr.push(emailId);
        localStorage.setItem("emails",JSON.stringify(arr));
        console.log(arr);
        return true;
    }catch(err){
        console.error(err);
    }
}
export async function saveTaskInfo(priority,description,adminEmail){
    const subtasks=JSON.parse(localStorage.getItem("subtasks"));
    const emails=JSON.parse(localStorage.getItem("emails"));
    const server=await fetch("http://localhost:5000/tasks/addTasks",{
        method:"POST",
        body:JSON.stringify({
            priority,
            description,
            emails,
            subtasks,
            adminEmail
        }),
        credentials:"include",
        headers:{
            'Content-type':"application/json"
        }
    });
    const res=await server.json();
    localStorage.removeItem("emails");
    localStorage.removeItem("subtasks");
   
    console.log(res);
    if(res.success)return true;

}