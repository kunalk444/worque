import React, { useEffect, useState } from 'react';
import { getCurrTask } from '../addTaskHelper';
import Members from './Members';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addData } from '../slices/insideTask';
import AssignTasks from './AssignTasks';

function ViewTask(props) {
    const [current, setCurrent] = useState(false);
    const[invited,setInvited]=useState(false);
    const { stopShow, taskDesc, taskId } = props;
    const[assignTaskFlag,setAssignTaskFlag]=useState(false);
    const user = useSelector(state => state.user);
    const currTask=useSelector(state=>state.insideTask.taskData);
    const dispatch=useDispatch();
    useEffect(() => {
        if (props.show) {
            (async () => {
                const arr = await getCurrTask(taskId);
                arr.isVisible=true;
                dispatch(addData(arr));
                console.log(arr);
            })();
        }
    }, [props.show,assignTaskFlag]);

    if (!currTask || !currTask.isVisible) return;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-12 max-w-6xl w-full shadow-xl relative h-[95vh] overflow-y-auto border-l-4 border-[#0d9488]">
                <button
                    onClick={()=>{
                            stopShow();
                            dispatch(addData({...currTask,isVisible:false}));
                        }
                    }
                    className="absolute top-8 right-8 text-4xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                >
                    X
                </button>
                <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 tracking-wide">Task Description: {taskDesc}</h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Admin: {currTask && currTask.admin}</h3>
                <div className="flex items-center justify-between space-x-4 mb-8">
    <h3 className="text-2xl font-semibold text-gray-800">Subtasks:</h3>
    {
        currTask && currTask.admin === user.email && (
            <div className="flex space-x-2">
                <button
                    className="bg-[#0d9488] text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg"
                    onClick={()=>setAssignTaskFlag(true)}
                >
                    Assign Tasks
                </button>
                <button
                    className="bg-[#7c3aed] text-white px-6 py-3 rounded-xl hover:bg-[#6d28d9] transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg"
                >
                    Add Tasks
                </button>
            </div>
        )
    }
</div>
                {
                    currTask && currTask.sub_tasks && Object.keys(currTask.sub_tasks).map((element) => {
                        return (
                            <div key={element} className="flex items-center space-x-6 mb-6">
                                <input
                                    type="radio"
                                    name={`subtask-${taskId}`}
                                    className="w-6 h-6 text-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/50 transition duration-300 border-2 border-gray-300 rounded-full checked:bg-[#0d9488] checked:border-transparent"
                                />
                                <span className="text-xl text-gray-800 font-medium">{element}</span>
                                {currTask.sub_tasks[element].length>0 && <p className='italic'>~Assigned to {currTask.sub_tasks[element]}</p>}
                            </div>
                        );
                    })
                }
                <div className="mt-12 flex space-x-8">
                    <button
                        onClick={() => setCurrent(true)}
                        className="bg-[#0d9488] text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition duration-300 text-xl font-semibold shadow-md hover:shadow-lg"
                    >
                        View Current Members
                    </button>
                    {
                        currTask && user.email===currTask.admin && 
                        <button
                        onClick={() => setInvited(true)}
                        className="bg-[#7c3aed] text-white px-8 py-4 rounded-xl hover:bg-[#6d28d9] transition duration-300 text-xl font-semibold shadow-md hover:shadow-lg"
                        >
                        View Invited Members
                        </button>
                    }
                </div>
                {currTask && <Members show={current} stopShow={() => setCurrent(false)} type="current" members={currTask.current_members} admin={currTask.admin} />}
                {currTask && 
                    <Members show={invited} stopShow={() => setInvited(false)} type="invited" members={currTask.invited_members} admin={currTask.admin} />
                }
                {
                    currTask && assignTaskFlag && 
                        <AssignTasks show={assignTaskFlag} stopShow={()=>setAssignTaskFlag(false)}/>
                }
            </div>
        </div>
    );
}

export default ViewTask;