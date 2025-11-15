import React, { useEffect, useState } from 'react';
import Addtask from './Addtask';
import { useSelector, useDispatch } from 'react-redux';
import ViewTask from './ViewTask';
import { useDrag, useDrop } from 'react-dnd';
import { loadSavedTasks } from '../boardHelper';
import { deleteTasks } from '../boardHelper';
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
                key={id}
                ref={dragRef}
                onClick={() => {
                    setViewTask(true);
                }}
                className="w-full bg-teal-50/80 text-gray-800 text-left px-5 py-3 rounded-xl hover:bg-teal-100 hover:text-[#0d9488] transition-all duration-300 shadow-md hover:shadow-lg font-medium text-base border border-teal-200/50"
            >
                {value}
            </button>
            {viewTask && <ViewTask show={viewTask} taskId={id} stopShow={() => setViewTask(false)} />}
            {delWidget && (
                <div
                    ref={delRef}
                    className="fixed top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 text-red-800 px-8 py-4 rounded-xl shadow-2xl font-semibold text-lg z-50 border border-red-200"
                >
                    <h1>Delete Item!</h1>
                </div>
            )}
        </>
    );
}

function Columns(props) {
    const type = props.type;
    const tasks = useSelector(state => state.tasks);
    const [task, setTask] = useState(false);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl min-w-[320px] max-w-[360px] flex flex-col gap-5 mx-auto border border-teal-100/50">
            <h2 className="text-2xl font-extrabold text-[#0d9488] tracking-tight border-b border-teal-200/50 pb-2">
                {type}
            </h2>
            <div className="flex flex-col gap-3 min-h-[200px]">
                {tasks.tasks[type] && Object.entries(tasks.tasks[type]).map(([key, value]) => (
                    <span key={key}>
                        <DraggableTaskButton id={key} value={value} />
                    </span>
                ))}
            </div>
            <div className="mt-auto">
                <button
                    onClick={() => {
                        setTask(true);
                    }}
                    className="w-full bg-[#7c3aed] text-white py-3 rounded-xl hover:bg-[#6d28d9] transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg"
                >
                    Add Task
                </button>
            </div>
            <Addtask priority={type} stopShow={() => { setTask(false) }} show={task} />
        </div>
    );
}

export default Columns;