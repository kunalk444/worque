export const loadSavedTasks=async(email)=>{
    const server=await fetch("http://localhost:5000/tasks/preloadtasks",{
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({email}),
        credentials:'include',
    });
    const res=await server.json();
    const obj={today:{},later:{},this_week:{}}
    if(!res.success)return null;
    res.success && res.tasks.forEach(element => {
        switch (element.task_priority) {
            case "today":
                obj.today[element._id]={
                    desc:element.task_description,
                    assignedAt:element.assignedAt,
                    expiresAt:element.expiresAt
                };
                break;
            case "later":
                obj.later[element._id]={desc:element.task_description,assignedAt:element.assignedAt};
                break;
            case "this_week":
                obj.this_week[element._id]={
                    desc:element.task_description,
                    assignedAt:element.assignedAt,
                    expiresAt:element.expiresAt
                };
                break;
            default:
                break;
        }
    });
    
    return obj;
    
}

export async function deleteTasks(taskId) {
    try {
        const res = await fetch("http://localhost:5000/tasks/deletetask", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ taskId }),
            credentials: 'include',
        });
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}