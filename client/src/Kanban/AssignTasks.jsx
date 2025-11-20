import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../slices/insideTask';

function Members(props) {
    const members = useSelector(state => state.insideTask.taskData.current_members);
    const id = useSelector(state => state.insideTask.taskData._id);
    const dispatch = useDispatch();
    if (!props.show) return null;

    async function handleMemberAssigned(member, subtask) {
        const data = await fetch("http://localhost:5000/tasks/assignsubtasks", {
            method: "POST",
            body: JSON.stringify({ member, subtask, id }),
            credentials: "include",
            headers: { 'Content-type': 'application/json' }
        });
        const res = await data.json();
        if (res.success) {
            res.newData.isVisible = true;
            dispatch(addData(res.newData));
            props.msg();
            props.stopShow();
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[400000] pointer-events-none">
            <div className="bg-[#ffffff] rounded-2xl p-10 w-full max-w-md shadow-2xl pointer-events-auto
                            border-4 border-[#14b8a6]/50
                            bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3C/svg%3E')] 
                            bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.25),transparent_70%)]
                            shadow-2xl ring-8 ring-[#14b8a6]/20">

                <button 
                    onClick={props.stopShow}
                    className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm 
                               flex items-center justify-center text-[#0f172a] hover:text-[#ef4444] 
                               text-3xl font-bold shadow-xl hover:scale-110 transition-all z-10"
                >
                    X
                </button>

                <h3 className="text-2xl font-extrabold text-[#0f172a] text-center mb-8">Assign To</h3>

                <select 
                    className="w-full px-6 py-5 text-lg font-semibold text-[#0f172a] bg-white border-4 border-[#14b8a6]/40 
                               rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14b8a6]/50 
                               shadow-inner cursor-pointer"
                    defaultValue=""
                    onChange={(e) => handleMemberAssigned(e.target.value, props.selectedTask)}
                >
                    <option value="" disabled>Select a member</option>
                    {members && members.map((user, idx) => (
                        <option key={idx} value={user} className="py-3 text-base">
                            {user}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function AssignTasks(props) {
    const tasks = useSelector(state => state.insideTask.taskData.sub_tasks);
    const [showMembers, setShowMembers] = useState(false);
    const [selectedTask, setSelectedTask] = useState();
    const [showMsg, setShowMsg] = useState(false);

    useEffect(() => {
        if (showMsg) setTimeout(() => setShowMsg(false), 1700);
    }, [showMsg]);

    if (!props.show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[#1e293b]/85 backdrop-blur-xl z-[350000]" onClick={props.stopShow} />

            <div className="fixed inset-0 flex items-center justify-center z-[350001] pointer-events-none">
                <div className="bg-[#ffffff] rounded-2xl p-10 w-full max-w-4xl shadow-2xl pointer-events-auto
                                border-4 border-[#14b8a6]/50 h-[75vh] overflow-y-auto relative
                                bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3C/svg%3E')] 
                                bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.22),transparent_70%)]
                                shadow-2xl ring-8 ring-[#14b8a6]/15">

                    {showMsg && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#14b8a6] text-white px-10 py-4 
                                        rounded-full font-bold text-xl shadow-2xl animate-bounce z-50">
                            Sub-Task Assigned!
                        </div>
                    )}

                    <button 
                        onClick={props.stopShow}
                        className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm 
                                   flex items-center justify-center text-[#0f172a] hover:text-[#ef4444] 
                                   text-4xl font-bold shadow-2xl hover:scale-110 transition-all z-50"
                    >
                        X
                    </button>

                    <h2 className="text-5xl font-extrabold text-[#0f172a] text-center mb-12 tracking-tight">
                        Assign Sub-Tasks
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {tasks && Object.keys(tasks).map((element) => (
                            tasks[element].length === 0 && (
                                <button
                                    key={element}
                                    onClick={() => {
                                        setSelectedTask(element);
                                        setShowMembers(true);
                                    }}
                                    className="group bg-gradient-to-br from-[#14b8a6]/10 to-[#ef4444]/10 p-8 rounded-2xl 
                                               border-4 border-dashed border-[#14b8a6]/50 hover:border-solid 
                                               hover:from-[#14b8a6]/20 hover:to-[#ef4444]/20 
                                               transition-all duration-400 shadow-xl hover:shadow-2xl 
                                               hover:scale-105 hover:-translate-y-2"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-3xl font-extrabold text-[#0f172a] group-hover:text-[#14b8a6] transition">
                                            {element}
                                        </div>
                                        <div className="w-16 h-16 bg-[#14b8a6]/20 rounded-full flex items-center justify-center 
                                                        group-hover:bg-[#14b8a6] group-hover:scale-110 transition-all">
                                            <svg className="w-10 h-10 text-[#14b8a6] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-[#0f172a]/70">Click to assign member</p>
                                    </div>
                                </button>
                            )
                        ))}
                    </div>

                    {showMembers && (
                        <Members 
                            show={showMembers} 
                            selectedTask={selectedTask} 
                            stopShow={() => setShowMembers(false)} 
                            msg={() => setShowMsg(true)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default AssignTasks;