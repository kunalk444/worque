import React, { useEffect, useState } from 'react';
import { getCurrTask,handleCompletedSubtasks } from '../addTaskHelper';
import Members from './Members';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addData } from '../slices/insideTask';
import AssignTasks from './AssignTasks';
import AddSubTask from './AddSubTask';
import Chat from './Chat';

function ViewTask(props) {
    const [current, setCurrent] = useState(false);
    const[invited,setInvited]=useState(false);
    const { show,stopShow,taskId } = props;
    const[assignTaskFlag,setAssignTaskFlag]=useState(false);
    const [subtaskFlag,setSubtaskFlag]=useState(false);
    const [chatFlag,setChatFlag]=useState(false);
    const user = useSelector(state => state.user);
    const currTask=useSelector(state=>state.insideTask.taskData);
    const completed=(currTask && currTask.completed_subtasks)?currTask.completed_subtasks.length:0;
    const total=(currTask && currTask.sub_tasks)?Object.keys(currTask.sub_tasks).length+completed:0;
    const dispatch=useDispatch();
    useEffect(() => {
        if (show) {
            (async () => {
                const arr = await getCurrTask(taskId);
                dispatch(addData(arr));
                localStorage.setItem("insideTaskVisible","true");
                
            })();
        }
    }, [show]);

    const isVisible=localStorage.getItem("insideTaskVisible");
    if (isVisible=="false" || isVisible==null || isVisible==undefined) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-12 max-w-6xl w-full shadow-xl relative h-[95vh] overflow-y-auto border-l-4 border-[#0d9488]">
                <button
                    onClick={()=>{
                            dispatch(addData({}));
                            localStorage.removeItem("insideTaskVisible");
                            stopShow();
                        }
                    }
                    className="absolute top-8 right-8 text-4xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                >
                    X
                </button>
                <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 tracking-wide">Task Description: {currTask?currTask.task_description:"Loading..."}</h2>
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
                    Assign Sub-Tasks
                </button>
                <button
                    className="bg-[#7c3aed] text-white px-6 py-3 rounded-xl hover:bg-[#6d28d9] transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg"
                    onClick={()=>setSubtaskFlag(true)}
                >
                    Add Sub-Tasks
                </button>
            </div>
        )
    }
</div>
                <progress 
                    max={100} 
                    value={(completed/total)*100}
                    className="w-full h-3 rounded-full appearance-none overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-[#0d9488] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:bg-[#0d9488] [&::-moz-progress-bar]:rounded-full"
                />
                {
                    currTask && currTask.sub_tasks && Object.keys(currTask.sub_tasks).map((element) => {
                        return (
                            <div key={element} className="flex items-center space-x-6 mb-6 p-4 bg-teal-50/30 rounded-xl hover:bg-teal-50/60 transition-colors duration-200">
                                <input
                                    type="radio"
                                    name={`subtask-${taskId}`}
                                    className="w-7 h-7 accent-[#0d9488] cursor-pointer focus:ring-4 focus:ring-[#0d9488]/50 transition duration-300 border-2 border-gray-300 rounded-full checked:bg-[#0d9488] checked:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={user.email!==currTask.sub_tasks[element]}
                                    onChange={async()=>{
                                        const res=await handleCompletedSubtasks(element,currTask._id);
                                        dispatch(addData(res.newDoc));
                                    }}
                                />
                                <span className="text-xl text-gray-800 font-medium">{element}</span>
                                {currTask.sub_tasks[element].length>0 && <p className='italic text-sm text-gray-600 bg-teal-100 px-3 py-1 rounded-full font-medium'>~Assigned to {currTask.sub_tasks[element]}</p>}
                            </div>
                        );
                    })
                }
                {
                    currTask && currTask.completed_subtasks && currTask.completed_subtasks.map((ele) => {
                        return (
                            <div 
                                key={ele} 
                                className="flex items-center gap-3 mb-3 p-3 bg-emerald-50/40 rounded-lg border-l-4 border-emerald-500 text-emerald-800 font-medium text-lg"
                            >
                                <span className="text-2xl">✅</span>
                                <span className="line-through opacity-90">{ele}</span>
                            </div>
                        );
                    })
                }
                <div className="mt-12 flex space-x-8 justify-center max-sm:flex-col max-sm:space-y-4 max-sm:space-x-0">
                    <button
                        onClick={() => setCurrent(true)}
                        className="bg-[#0d9488] text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition duration-300 text-xl font-semibold shadow-md hover:shadow-lg max-sm:w-full"
                    >
                        View Current Members
                    </button>
                    <button
                        onClick={()=>setChatFlag(true)}
                        className="bg-[#0d9488] text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition duration-300 text-xl font-semibold shadow-md hover:shadow-lg max-sm:w-full"
                    >
                        Chat Room
                    </button>
                    {
                        currTask && user.email===currTask.admin && 
                        <button
                        onClick={() => setInvited(true)}
                        className="bg-[#7c3aed] text-white px-8 py-4 rounded-xl hover:bg-[#6d28d9] transition duration-300 text-xl font-semibold shadow-md hover:shadow-lg max-sm:w-full"
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
                {
                    currTask && subtaskFlag && 
                    <AddSubTask show={subtaskFlag} stopShow={()=>setSubtaskFlag(false)}/>
                }
                {
                    <Chat show={chatFlag} stopShow={()=>setChatFlag(false)}/>
                }
            </div>
        </div>
    );
}

export default ViewTask;