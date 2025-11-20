import React, { useEffect, useState } from 'react';
import Addtask from './Addtask';
import { useSelector, useDispatch } from 'react-redux';
import ViewTask from './ViewTask';
import { useDrag, useDrop } from 'react-dnd';
import { loadSavedTasks, deleteTasks } from '../boardHelper';
import { saveTasksInRedux } from '../slices/taskSlice';

function DraggableTaskButton(props) {
    const id = props.id;
    const value = props.value;
    const [viewTask, setViewTask] = useState(false);
    const [delWidget, setDelWidget] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'Task-Item',
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }));

    const [{ hasDropped }, delRef] = useDrop(() => ({
        accept: 'Task-Item',
        drop: async (droppedTask) => {
            const res = await deleteTasks(droppedTask.id);
            if (res.success) {
                console.log("item deleted!");
                const data = await loadSavedTasks(user.email);
                dispatch(saveTasksInRedux(data));
            }
        },
        collect: (monitor) => ({
            hasDropped: monitor.didDrop(),
        })
    }));

    useEffect(() => {
        if (isDragging) setDelWidget(true);
    }, [isDragging]);

    useEffect(() => {
        if (hasDropped) setDelWidget(false);
    }, [hasDropped]);

    return (
        <>
            <button
                ref={dragRef}
                onClick={() => setViewTask(true)}
                className="w-full bg-[#ffffff] text-[#0f172a] p-4 rounded-xl border-2 border-[#14b8a6]/20 
                         hover:bg-[#14b8a6]/10 hover:border-[#14b8a6]/40 hover:scale-[1.02] 
                         transition-all duration-300 shadow-md hover:shadow-lg cursor-move
                         flex flex-col gap-2 group"
            >
                
                <div className="font-bold text-base text-left leading-tight">
                    {value.desc}
                </div>

               
                <div className="flex justify-end text-xs font-medium text-[#0f172a]/70">
                    <div className="flex flex-col items-end gap-0.5">
                        {value.assignedAt && (
                            <p>
                                <span className="text-[#0f172a]/60">Assigned:</span>{' '}
                                <span className="font-semibold text-[#14b8a6]">
                                    {new Date(value.assignedAt).toLocaleDateString()}
                                </span>
                            </p>
                        )}
                        {value.expiresAt && (
                            <p>
                                <span className="text-[#0f172a]/60">Due:</span>{' '}
                                <span className="font-semibold text-[#14b8a6]">
                                    {new Date(value.expiresAt).toLocaleDateString()}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </button>

            {viewTask && <ViewTask show={viewTask} taskId={id} stopShow={() => setViewTask(false)} />}

            {delWidget && (
                <div
                    ref={delRef}
                    className="fixed inset-0 flex items-center justify-center z-[1000] pointer-events-none"
                >
                    <div className="bg-[#ef4444] text-white px-14 py-10 rounded-3xl shadow-2xl font-extrabold text-3xl 
                                    border-8 border-white/40 backdrop-blur-lg animate-pulse pointer-events-auto
                                    tracking-widest">
                        DROP TO DELETE
                    </div>
                </div>
            )}
        </>
    );
}

function Columns(props) {
    const type = props.type;
    const tasktemp = useSelector(state => state.tasks);
    const [task, setTask] = useState(false);
    const tasks=tasktemp.tasks;
    const currTasks=tasks[type];

    const columnTitles = {
        today: "Today",
        this_week: "This Week",
        later: "Later"
    };

    return (
        <div className="bg-[#ffffff] rounded-2xl p-6 shadow-2xl min-w-[320px] max-w-[380px] flex flex-col gap-5 border-2 border-[#14b8a6]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url(...)] opacity-60 z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(...)] z-0" />
            <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight pb-3 border-b-2 border-[#14b8a6]/30 relative z-10">
                {columnTitles[type] || type}
            </h2>

            <div className="flex flex-col gap-4 min-h-[300px] relative z-10">
                {
                    currTasks && Object.keys(currTasks).map((element,index)=>(
                        <DraggableTaskButton key={index} id={element} value={currTasks[element]} />
                    ))
                }
            </div>

            <div className="mt-auto relative z-10">
                <button
                    onClick={() => setTask(true)}
                    className="w-full bg-[#14b8a6] text-white py-4 rounded-xl hover:bg-[#ef4444] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 font-bold text-base shadow-lg hover:scale-105"
                >
                    + Add Task
                </button>
            </div>

            <Addtask priority={type} show={task} stopShow={() => setTask(false)} />
        </div>
    );
}

export default Columns;