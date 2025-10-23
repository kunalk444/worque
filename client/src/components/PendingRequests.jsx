import React from 'react'
import { useSelector } from 'react-redux';
function PendingRequests() {
    const user=useSelector(state=>state.user);
    (async()=>{
        const res=await fetch("http://localhost:5000/user/pendingRequests",{
            method:"POST",
            body:JSON.stringify({email:user.email}),
            headers:{
                "Content-type":"application/json"
            }
        });
        const arr=await res.json();
        console.log(arr);    
    })();
  return (
    <div>
        
    </div>
  )
}

export default PendingRequests;