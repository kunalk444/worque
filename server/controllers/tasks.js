const express=require("express");
const taskModel =require("../models/tasks.js");
const userModel=require("../models/user.js");

async function preloadTaskMetaInfo(email){
    const obj=await taskModel.find({current_members:{$in:[email]}},{task_priority:1,task_description:1});
    return obj;
    
}
const loadPendingRequests=async(email)=>{
    const arr=await userModel.findOne({email},{pending_requests:1});
    return arr;
}
module.exports={
    preloadTaskMetaInfo,
    loadPendingRequests,
}