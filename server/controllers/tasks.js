const express=require("express");
const taskModel =require("../models/tasks.js");
const userModel=require("../models/user.js");

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
            )
    if(done)return {success:true,newDoc:done};
    return {success:false};
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
    return {success:false};
}
module.exports={
    preloadTaskMetaInfo,
    loadTaskInfo,
    assignSubTasks,
    addSubTasks,
    handleCompletedSubtask,
}