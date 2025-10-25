const mongoose=require("mongoose");
const userModel=require("../models/user.js")
const crypto=require("crypto");
const taskModel = require("../models/tasks.js");
const pendingRequestsModel = require("../models/pendingrequests.js");
const handleSignup=async(uname,password,email)=>{
    try{
        const newUser= await userModel.create({
            uname,
            password,
            email
        });
        return ({uname:newUser.uname,password:newUser.password,email:newUser.email,id:newUser._id});
    }catch(err){
        console.log("error:",err);
    }
}
const handleLogin=async(uemail,password)=>{
    const user=await userModel.findOne({
        email:uemail
    })
    if(!user)return null;
    const salt=user.salt;
    const existingHashedPassword=user.password;
    const newHashedPassword=crypto.createHmac("sha256",salt)
                                .update(password)
                                .digest("hex");
    if(existingHashedPassword===newHashedPassword){
        return ({uname:user.uname,password:user.password,email:user.email,id:user._id});
    }
    return null;
}
const handleGoogleClient=async(name,uemail)=>{
    const user=userModel.findOne({
        email:uemail
    });
    if(!user){
        const newUser=await userModel.create({
            uname:name,
            email:uemail
        });
    }

}
const loadPendingRequests=async(email)=>{
    const arr=await userModel.findOne({email},{pending_requests:1});
    if(!arr)return {};
    if(arr.pending_requests.length==0)return {};
    const obj={};
    for(const ele of arr.pending_requests){
        const task=await taskModel.findOne({_id:ele},{task_priority:1,task_description:1,admin:1});
        obj[ele]=[task.task_description,task.task_priority,task.admin];
    }

    return obj;
}
const handlePendingRequests=async(userId,taskId,type)=>{
    try{
        const obj=await userModel.updateOne({_id:userId},{$pull:{pending_requests:new mongoose.Types.ObjectId(taskId)}});
        if(type=="accept"){
            const taskAddedInUser=await userModel.updateOne({_id:userId},{$addToSet:{current_tasks:mongoose.Types.ObjectId(taskId)}},{returnDocument:"after"});
            console.log(taskAddedInUser);
            const addInTaskDb=await taskModel.updateOne({_id:taskId},{$addToSet:{current_members:taskAddedInUser.email}});
        }
        return {success:true};
    }catch(err){
        return {success:false};
    }
    
    
}
module.exports={
    handleSignup,
    handleLogin,
    handleGoogleClient,
    loadPendingRequests,
    handlePendingRequests,
}