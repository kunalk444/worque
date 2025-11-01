const express=require("express");
const app=express();
const {Router}=require("express");
const taskRouter=Router();
const taskModel=require("../models/tasks.js");
const {preloadTaskMetaInfo,loadTaskInfo,assignSubTasks,addSubTasks,handleCompletedSubtask,handleDraggedTask} =require("../controllers/tasks.js")

taskRouter.post("/addTasks",async(req,res)=>{
    const {priority,description,emails,subtasks,adminEmail}=req.body;
    const map=new Map();
    for(const ele of subtasks)map.set(ele,"");
    const task=await taskModel.create({
        task_priority:priority,
        task_description:description,
        sub_tasks:map,
        invited_members:emails,
        admin:adminEmail
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

taskRouter.post("/gettasks",async(req,res)=>{
    const {taskId}=req.body;
    const obj=await loadTaskInfo(taskId);
    return res.json(obj);
});
taskRouter.post("/assignsubtasks",async(req,res)=>{
    const {member,subtask,id}=req.body;
    console.log(member,subtask,id);
    const recdData=await assignSubTasks(member,subtask,id);
    return res.json(recdData);
});
taskRouter.post("/addsubtasks",async(req,res)=>{
    const {taskId,desc}=req.body;
    console.log(taskId,desc);
    const subRes=await addSubTasks(taskId,desc);
    return res.json(subRes); 
});
taskRouter.post("/completedsubtask",async(req,res)=>{
    const {desc,id}=req.body;
    const subRes=await handleCompletedSubtask(desc,id);
    return res.json(subRes);
});
taskRouter.post("/draggedtasks",async(req,res)=>{
    const {id,type,email}=req.body;
    const dragRes=await handleDraggedTask(id,type,email);
    return  res.json(dragRes);
})

module.exports= {taskRouter};