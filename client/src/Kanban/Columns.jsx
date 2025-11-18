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
                className="w-full bg-[#ffffff] text-[#0f172a] text-left px-5 py-4 rounded-xl hover:bg-[#14b8a6]/10 hover:text-[#14b8a6] hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-base border border-[#14b8a6]/20 cursor-move"
            >
                {value}
            </button>

            {viewTask && <ViewTask show={viewTask} taskId={id} stopShow={() => setViewTask(false)} />}

            {delWidget && (
                <div
                    ref={delRef}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ef4444] text-white px-10 py-6 rounded-2xl shadow-2xl font-bold text-xl z-[200] border-4 border-white/30 backdrop-blur-md animate-pulse"
                >
                    Drop here to Delete
                </div>
            )}
        </>
    );
}

function Columns(props) {
    const type = props.type;
    const tasks = useSelector(state => state.tasks);
    const [task, setTask] = useState(false);

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
                {tasks.tasks[type] && Object.entries(tasks.tasks[type]).map(([key, value]) => (
                    <DraggableTaskButton key={key} id={key} value={value} />
                ))}
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