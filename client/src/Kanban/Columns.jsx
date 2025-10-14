import React, { useState } from 'react'
import Addtask from './Addtask';

function Columns(props) {
    const type=props.type;
    const [task,setTask]=useState(false);
    return (
    <div className='columns'>
        <h2 className='columntitle'>{type}</h2>
        <div className='columnbutton'>
            <button onClick={()=>{
                setTask(true);
                console.log("working");
            }}>Add task</button>
        </div>
        <Addtask priority={type} stopShow={()=>{setTask(false)}} show={task} />
    </div>
  )
}

export default Columns