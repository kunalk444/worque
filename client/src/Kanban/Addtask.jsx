import React, { useRef, useState } from 'react'
import { addSubTask, saveTaskInfo, sendEmail } from '../addTaskHelper';
import { useSelector, useDispatch } from 'react-redux';
import { loadSavedTasks } from '../boardHelper';
import { saveTasksInRedux } from '../slices/taskSlice';

function Addtask({ priority, stopShow, show }) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [member, addMember] = useState("");
    const [subtaskFlag, setSubtaskFlag] = useState(false);
    const [memberFlag, setMemberFlag] = useState(false);
    const [taskFlag, setTaskFlag] = useState(false);
    const descriptionRef = useRef("");
    const subRef = useRef("");

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const done = await saveTaskInfo(priority, descriptionRef.current.value, user.email);
        if (done) {
            setTaskFlag(true);
            (async () => {
                const obj = await loadSavedTasks(user.email);
                dispatch(saveTasksInRedux(obj));
            })();
        }
    }

    if (subtaskFlag) {
        setTimeout(() => {
            setSubtaskFlag(false);
        }, 1800);
    }
    if (memberFlag) {
        setTimeout(() => {
            setMemberFlag(false);
        }, 1800);
    }
    if (taskFlag) {
        setTimeout(() => {
            setTaskFlag(false);
            stopShow();
        }, 1800);
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            {
                subtaskFlag && <h2 className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#0d9488] text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                    Subtask added!
                </h2>
            }
            {
                memberFlag && <h2 className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#7c3aed]/80 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                    Email data saved! Request will be sent once task is added!
                </h2>
            }
            {
                taskFlag && <h2 className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#6d28d9] text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                    Task added successfully!
                </h2>
            }

            <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative transition-transform transform scale-100 hover:scale-[1.01] duration-300">
                <button
                    className="absolute top-4 right-4 text-xl font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    onClick={stopShow}
                >
                    X
                </button>

                <h2 className="text-2xl font-bold mb-6 text-[#0d9488] tracking-tight">Add a task to: {priority}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Enter task description"
                        className="w-full p-4 mb-6 rounded-lg border border-teal-200 outline-none focus:ring-2 focus:ring-[#0d9488] transition bg-teal-50/50 text-gray-800 text-base placeholder-gray-500"
                        ref={descriptionRef}
                        required
                    />

                    <div className="flex gap-4 mb-6">
                        <input
                            placeholder="Add sub-tasks"
                            className="flex-1 p-4 rounded-lg border border-teal-200 outline-none focus:ring-2 focus:ring-[#0d9488] transition bg-teal-50/50 text-gray-800 text-base placeholder-gray-500"
                            ref={subRef}
                        />
                        <button
                            className="bg-[#0d9488] text-white rounded-lg px-6 py-3 hover:bg-teal-600 transition-all duration-300 text-base shadow-md hover:shadow-lg"
                            onClick={() => {
                                const done = addSubTask(subRef.current.value);
                                subRef.current.value = "";
                                if (done) setSubtaskFlag(true);
                            }}
                            type='button'
                        >
                            Add
                        </button>
                    </div>

                    <div className="mb-6">
                        <h4 className="mb-3 font-medium text-lg text-gray-800">Add members:</h4>
                        <div className="flex gap-4">
                            <input
                                type='email'
                                placeholder="Enter email id!"
                                className="flex-1 p-4 rounded-lg border border-teal-200 outline-none focus:ring-2 focus:ring-[#0d9488] transition bg-teal-50/50 text-gray-800 text-base placeholder-gray-500"
                                onChange={(e) => {
                                    addMember(e.target.value);
                                }}
                            />
                            <button
                                className="bg-[#7c3aed] text-white rounded-lg px-6 py-3 hover:bg-[#6d28d9] transition-all duration-300 text-base shadow-md hover:shadow-lg"
                                onClick={() => {
                                    const done = sendEmail(member);
                                    if (done) setMemberFlag(done);
                                }}
                                type='button'
                            >
                                Send Request!
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-[#7c3aed] text-white rounded-lg px-6 py-4 hover:bg-[#6d28d9] transition-all duration-300 font-medium text-base shadow-md hover:shadow-lg"
                    >
                        Create Task!
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Addtask