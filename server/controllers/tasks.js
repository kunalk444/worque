const express=require("express");
const taskModel =require("../models/tasks.js");
const userModel=require("../models/user.js");
const mongoose=require("mongoose");
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
    if(done){
        return {success:true,newData:done};
    }
    return {success:false};
}
const addSubTasks=async(taskId,desc)=>{
    console.log("reached!");
    console.log("before update:");
    console.log(desc);
    console.log("Connection state:", mongoose.connection.readyState);
    console.log(Object.keys(mongoose.models));
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
    if(newDoc)return {success:true,newDoc};
    
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
module.exports={
    preloadTaskMetaInfo,
    loadTaskInfo,
    assignSubTasks,
    addSubTasks,
    handleCompletedSubtask,
    handleDraggedTask,
}