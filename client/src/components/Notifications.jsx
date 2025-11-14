import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveNotificationsInRedux } from '../slices/notificationSlice';

import ViewTask from '../Kanban/ViewTask';
import { useState } from 'react';

async function getUserNotifications(userId) {
    const res = await fetch("http://localhost:5000/user/notifications", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ userId }),
        credentials: 'include'
    });
    return await res.json();
}

async function handleTaskUnArchiving(taskId,notifId,adminId){
    const res=await fetch("http://localhost:5000/tasks/unarchivetask",{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({taskId,notifId,adminId}),
        credentials:'include'
    });
    return await res.json();
}

function HandleNotificationClick(props){
    const {taskId,type,stopShow,showTask,notifId}=props;
    const [msg,setMsg]=useState();
    const dispatch=useDispatch();
    const adminId=useSelector(state=>state.user.id);
    if(type!=='assigned_subtask'){
        (async()=>{
            const res=await handleTaskUnArchiving(taskId,notifId,adminId);
            console.log(res);
            if(res.success){
                setMsg("Task Successfully Unarchived!");
                const res = await getUserNotifications(adminId);
                if (res.success)dispatch(saveNotificationsInRedux(res.notifications))
            }
        })();
    }
    msg && setTimeout(()=>{
        setMsg(null);
    },1500);
    return (
        <>
            {type==='assigned_subtask' &&
             <ViewTask 
                show={showTask}
                stopShow={()=>{stopShow(false)}}
                taskId={taskId}
            />}
            {msg && <h3>{msg}</h3>}
        </>
    );
    
}

function Notifications() {
    const userId = useSelector(state => state.user.id);
    const notifications = useSelector(state => state.notifications.notificationsArray);
    const [openNotif,setOpenNotif]=useState(false);
    const [taskdata,setTaskData]=useState();
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            const res = await getUserNotifications(userId);
            if (res.success) dispatch(saveNotificationsInRedux(res.notifications));
        })();
    }, []);

    async function handleRemoveNotification(notifId){
        const data=await fetch("http://localhost:5000/user/removenotif",{
            method:'POST',
            body:JSON.stringify({notifId,userId}),
            headers:{
                'Content-type':'application/json'
            },
            credentials:'include'
        })
        const res=await data.json();
        if(res.success){
            const res2 = await getUserNotifications(userId);
            if (res2.success) dispatch(saveNotificationsInRedux(res2.notifications))
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 tracking-wide text-center">Notifications</h2>
            <div className="w-full max-w-4xl flex flex-col gap-4">
                {notifications && [...notifications].reverse().map((element, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between gap-4 hover:bg-teal-50/30 transition-colors duration-200 border-l-4 border-[#0d9488]"
                    >
                        <h2 className="text-lg font-medium text-gray-800">{element.desc}</h2>
                        <button onClick={()=>handleRemoveNotification(element._id)}>X</button>
                        <button
                            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                            onClick={()=>{
                                setTaskData(
                                    {
                                        taskId:element.taskId,
                                        type:element.notiftype,
                                        notifId:element._id
                                    }
                                );
                                setOpenNotif(true);
                            }}
                        >
                            Click here!
                        </button>
                    </div>
                ))}
            </div>
            {taskdata && openNotif &&
                <HandleNotificationClick 
                    type={taskdata.type} 
                    taskId={taskdata.taskId}
                    stopShow={()=>{
                        setOpenNotif(false);
                        setTaskData(null);
                    }}
                    showTask={openNotif}
                    notifId={taskdata.notifId}
                />
            }
        </div>
    );
}

export default Notifications;