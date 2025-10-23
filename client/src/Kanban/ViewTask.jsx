import React, { useEffect, useState } from 'react';
import { getTaskInfo } from '../addTaskHelper';
import Members from './Members';

function ViewTask(props) {
    const [taskInfo, setTaskInfo] = useState();
    const [invited, setInvited] = useState(false);
    const [current, setCurrent] = useState(false);
    const { stopShow, taskDesc, taskId } = props;

    useEffect(() => {
        if (props.show) {
            (async () => {
                const arr = await getTaskInfo(taskId);
                setTaskInfo(arr);
            })();
        }
    }, [taskId, props.show]);

    if (!props.show) return;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-12 max-w-6xl w-full shadow-xl relative h-[95vh] overflow-y-auto border-l-4 border-[#0d9488]">
                <button
                    onClick={stopShow}
                    className="absolute top-8 right-8 text-4xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                >
                    X
                </button>
                <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 tracking-wide">Task Description: {taskDesc}</h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Admin: {taskInfo && taskInfo.admin}</h3>
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Subtasks:</h3>
                {
                    taskInfo && taskInfo.sub_tasks && taskInfo.sub_tasks.map((element) => {
                        return (
                            <div key={element} className="flex items-center space-x-6 mb-6">
                                <input
                                    type="radio"
                                    name={`subtask-${taskId}`}
                                    className="w-6 h-6 text-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/50 transition duration-300 border-2 border-gray-300 rounded-full checked:bg-[#0d9488] checked:border-transparent"
                                />
                                <span className="text-xl text-gray-800 font-medium">{element}</span>
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
                    <button
                        onClick={() => setInvited(true)}
                        className="bg-[#7c3aed] text-white px-8 py-4 rounded-xl hover:bg-[#6d28d9] transition duration-300 text-xl font-semibold shadow-md hover:shadow-lg"
                    >
                        View Invited Members
                    </button>
                </div>
                {taskInfo && <Members show={current} stopShow={() => setCurrent(false)} type="current" members={taskInfo.current_members} />}
                {taskInfo && <Members show={invited} stopShow={() => setInvited(false)} type="invited" members={taskInfo.invited_members} />}
            </div>
        </div>
    );
}

export default ViewTask;