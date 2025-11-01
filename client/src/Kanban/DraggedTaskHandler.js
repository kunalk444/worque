export async function handleDraggedTask(id,type,email){
    const data=await fetch("http://localhost:5000/tasks/draggedtasks",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({id,type,email}),
        credentials:'include'
    })
    return await data.json(); 
}