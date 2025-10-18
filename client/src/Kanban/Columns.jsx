import React, { useState } from 'react'
import Addtask from './Addtask';
import { useSelector } from 'react-redux';

function Columns(props) {
    const type=props.type;
    const tasks=useSelector(state=>state.tasks);
    const [task,setTask]=useState(false);
    console.log(tasks.tasks);
    return (
    <div className='columns'>
        <h2 className='columntitle'>{type}</h2>
        {
            tasks.tasks[type] && Object.entries(tasks.tasks[type]).map(([key,value])=>(
                 <p key={key}>{value}</p>
            ))
        }
        <div className='columnbutton'>
            <button onClick={()=>{
                setTask(true);
            }}>Add task</button>
        </div>
        <Addtask priority={type} stopShow={()=>{setTask(false)}} show={task} />
    </div>
  )
}

export default Columns