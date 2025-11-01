import React, {useState } from 'react';
import Addtask from './Addtask';
import { useSelector } from 'react-redux';
import ViewTask from './ViewTask';
import { useDrag} from 'react-dnd';
function DraggableTaskButton(props)
{
    const id=props.id;
    const value=props.value;
    const [viewTask,setViewTask]=useState(false);
    const [,dragRef]=useDrag(()=>(
        {
            type:'Task-Item',
            item:{id}

        }
    ));
    return (
        <>
        <button
            key={id}
            ref={dragRef}
            onClick={()=>{   
                setViewTask(true);   
            }}
            className="w-full bg-teal-50/50 text-gray-800 text-left px-4 py-2 rounded-lg hover:bg-teal-100 hover:text-[#0d9488] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
            {value}
        </button>
        {viewTask && <ViewTask show={viewTask} taskId={id} stopShow={()=>setViewTask(false)} />}
        </>
    );
}
function Columns(props) {
    const type = props.type;
    const tasks = useSelector(state => state.tasks);
    const [task, setTask] = useState(false);
    
    
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] max-w-[360px] flex flex-col gap-4 mx-auto">
            <h2 className="text-xl font-bold text-[#0d9488] tracking-tight">
                {type}
            </h2>
            <div className="flex flex-col gap-3">
                {tasks.tasks[type] && Object.entries(tasks.tasks[type]).map(([key, value]) => (
                    <span key={key}><DraggableTaskButton id={key} value={value}/></span>
                ))}
            </div>
            <div className="mt-auto">
                <button
                    onClick={() => {
                        setTask(true);
                    }}
                    className="w-full bg-[#7c3aed] text-white py-2.5 rounded-lg hover:bg-[#6d28d9] transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg"
                >
                    Add Task
                </button>
            </div>
            <Addtask priority={type} stopShow={() => { setTask(false) }} show={task} />
        </div>
    )
}

export default Columns