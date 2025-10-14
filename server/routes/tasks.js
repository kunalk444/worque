const express=require("express");
const app=express();
const {Router}=require("express");
const {addMembers}=require("../controllers/tasks.js");
const taskRouter=Router();

taskRouter.post("/addTasks",async(req,res)=>{
    const {emails}=req.body;
    const done=await addMembers(emails);
    if(done)return res.json({success:true});
    return res.json({success:false});
});

module.exports= {taskRouter};