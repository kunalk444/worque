const express=require("express");
const taskModel =require("../models/tasks.js");
const userModel=require("../models/user.js");
const mongoose=require("mongoose");
const archiveModel = require("../models/archivedtasks.js");
async function preloadTaskMetaInfo(email){
    const obj=await taskModel.find({current_members:{$in:[email]}},{task_priority:1,task_description:1});
    return obj;
    
}

const loadTaskInfo=async(taskId)=>{
    return await taskModel.findOne({_id:taskId});
}

const assignSubTasks=async(member,subtask,id)=>{
    const done=await taskModel.findOneAndUpdate({_id:id},
                        {$set:{
                            [`sub_tasks.${subtask}`]:member,
                        }},
                        {new:true}
                    );
    const notifyUser=await userModel.findOneAndUpdate(
        {
            email:member,
        },
        {
            $push:{
                    notifications:{
                        notiftype:"assigned_subtask",
                        taskId:new mongoose.Types.ObjectId(id),
                        desc:`You've been assignd a subtask for: ${done.task_description}!Click to check it out`,
                        timeStamp:Date.now(),
                    }
                }
        }
    )
    if(done){
        return {success:true,newData:done};
    }
    return {success:false};
}
const addSubTasks=async(taskId,desc)=>{
    try{
    const done=await taskModel.findOneAndUpdate(
                {_id:taskId},
                {
                    $set:{
                        [`sub_tasks.${desc}`]:"",
                    }
                },
                {
                    new:true
                }
            );
    if(done)return {success:true,newDoc:done};
    return {success:false};
    }
    catch(err){
        console.log(err);
    }
    
}
const handleCompletedSubtask=async(desc,id)=>{
    const newDoc=await taskModel.findOneAndUpdate(
                {
                    _id:id
                },
                {
                    $unset:{
                        [`sub_tasks.${desc}`]:""
                    },
                    $addToSet:{
                        completed_subtasks:desc 
                    }
                },
                {
                    new:true
                }
            );
    const ifAllTasksCompleted=(newDoc.completed_subtasks.length>=1 && newDoc.sub_tasks.size==0);
    if(newDoc)return {success:true,newDoc,ifAllTasksCompleted};
    
}
const handleDraggedTask=async(id,type,email)=>{
    let time=null;
    if(type==='today')time=new Date(Date.now() + 24*3600*1000);
    if(type==='this_week')time=new Date(Date.now() + (7-new Date().getDay())*24*3600*1000);
    const newDoc=await taskModel.findOneAndUpdate(
        {
            _id:id
        },
        {
            task_priority:type,
            expiresAt:time,
            
        }
    );
    if(!newDoc)return {success:false};
    return {success:true,newDoc};
    
}
const deleteTask=async(taskId)=>{
    const res=await taskModel.deleteOne({_id:taskId});
    if(res)return {success:true};
    return {success:false};
}

const unarchiveTask=async(taskId)=>{
    console.log(taskId);
    const step1=await archiveModel.findOneAndDelete({_id:taskId});
    if(step1){
        obj=step1.toObject();
        const step2=await taskModel.create(obj);
        if(step2)return {success:true};
        else {return {success:false};}
    }
    return {success:false};
}

module.exports={
    preloadTaskMetaInfo,
    loadTaskInfo,
    assignSubTasks,
    addSubTasks,
    handleCompletedSubtask,
    handleDraggedTask,
    deleteTask,
    unarchiveTask
}