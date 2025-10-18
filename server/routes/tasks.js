const express=require("express");
const app=express();
const {Router}=require("express");
const taskRouter=Router();
const taskModel=require("../models/tasks.js");
const {preloadTaskMetaInfo,loadPendingRequests} =require("../controllers/tasks.js")

taskRouter.post("/addTasks",async(req,res)=>{
    const {priority,description,emails,subtasks}=req.body;
    const task=await taskModel.create({
        task_priority:priority,
        task_description:description,
        sub_tasks:subtasks,
        invited_members:emails,
    });
    if(task!==null)return res.json({success:true});
    return res.json({success:false});
});
taskRouter.post("/preloadtasks",async(req,res)=>{
    const {email}=req.body;
    const obj=await preloadTaskMetaInfo(email);
    if(!obj)return res.json({success:false});
    return res.json({success:true,tasks:obj});
});
taskRouter.post("/pendingRequests",async(req,res)=>{
    const {email}=req.body;
    const arr=await loadPendingRequests(email);
    return res.json({requests:arr});
});

module.exports= {taskRouter};