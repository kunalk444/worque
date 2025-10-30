import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../slices/insideTask';

function Members(props){
    const members=useSelector(state=>state.insideTask.taskData.current_members);
    const id=useSelector(state=>state.insideTask.taskData._id);
    const dispatch=useDispatch();
    if(!props.show)return null;
    
    async function handleMemberAssigned(member,subtask){
        const data=await fetch("http://localhost:5000/tasks/assignsubtasks",{
            method:"POST",
            body:JSON.stringify({member,subtask,id}),
            credentials:"include",
            headers:{
                'Content-type':'application/json'
            }
        })
        const res=await data.json();
        console.log(res);
        if(res.success){
            res.newData.isVisible=true;
            dispatch(addData(res.newData));
            props.msg();
            props.stopShow();    
        }
    } 
    
    return(
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-200 relative">
                <button 
                    onClick={props.stopShow}
                    className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800 transition-colors"
                >
                    X
                </button>
                <select 
                    className="w-full p-4 text-lg border-2 border-[#0d9488] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0d9488]/30 transition duration-200 bg-white text-gray-800"
                    defaultValue=""
                    onChange={
                        function(e){
                            handleMemberAssigned(e.target.value,props.selectedTask)
                        }
                    }
                >
                    <option value="" disabled className="text-gray-500">Select a member</option>
                    {
                        members && members.map((user, idx) => (
                            <option key={idx} value={user} className="text-gray-700">
                                {user}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

function AssignTasks(props) {
    const tasks=useSelector(state=>state.insideTask.taskData.sub_tasks);
    const [showMembers,setShowMembers]=useState(false);
    const [selectedTask,setSelectedTask]=useState();
    const [showMsg,setShowMsg]=useState(false);
    useEffect(()=>{
        if(showMsg)setTimeout(()=>setShowMsg(false),1700);
    },[showMsg]);
    if(!props.show)return null;    
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-40 p-6">
            <div className="bg-white rounded-2xl p-10 max-w-3xl w-full shadow-2xl border-l-4 border-[#0d9488] h-[75vh] overflow-y-auto relative">
                {showMsg && 
                    <h3 className="text-xl font-medium text-white bg-[#0d9488]/90 px-5 py-2.5 rounded-lg text-center mb-6 shadow-md animate-pulse">
                        Sub-Task Assigned! 
                    </h3>
                }
                <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 text-center tracking-wide">
                    Assign Tasks
                </h2>
                <button 
                    onClick={props.stopShow}
                    className="absolute top-8 right-8 text-3xl font-bold text-gray-700 hover:text-gray-900 transition-colors bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                    X
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {
                        tasks && Object.keys(tasks).map((element) => {
                            return (tasks[element].length===0 && 
                                <button
                                    value={element}
                                    key={element}
                                    onClick={function(e){
                                        console.log(e.currentTarget.value);
                                        setSelectedTask(e.currentTarget.value);
                                        setShowMembers(true);
                                    }}
                                    className="group bg-gradient-to-r from-[#0d9488]/10 to-[#7c3aed]/10 p-5 rounded-xl border-2 border-dashed border-[#0d9488] hover:border-solid hover:from-[#0d9488]/20 hover:to-[#7c3aed]/20 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-800 group-hover:text-[#0d9488] transition-colors">
                                            {element}
                                        </span>
                                        <svg className="w-5 h-5 text-[#0d9488] group-hover:scale-110 transition-transform"
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Click to assign</p>
                                </button>
                            )
                        })
                    }
                </div>

                {showMembers && <Members show={showMembers} selectedTask={selectedTask} stopShow={()=>setShowMembers(false)} msg={()=>setShowMsg(true)}/>}
            </div>
        </div>
    )
}

export default AssignTasks