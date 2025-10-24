const mongoose=require("mongoose");
const userModel=require("../models/user.js")
const crypto=require("crypto");
const taskModel = require("../models/tasks.js");
const handleSignup=async(uname,password,email)=>{
    try{
        const newUser= await userModel.create({
            uname,
            password,
            email
        });
        return ({uname:newUser.uname,password:newUser.password,email:newUser.email});
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
    if(existingHashedPassword===newHashedPassword)return ({uname:user.uname,password:user.password,email:user.email});
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
    const obj={};
    for(const ele of arr.pending_requests){
        const task=await taskModel.findOne({_id:ele},{task_priority:1,task_description:1,admin:1});
        obj[ele]=[task.task_description,task.task_priority,task.admin];
    }
    obj.user={id:arr._id};
    return obj;
}
const handlePendingRequests=async(taskId,type)=>{
    if(type==="reject"){
        const obj=userModel.updateOne({_});
    }
}
module.exports={
    handleSignup,
    handleLogin,
    handleGoogleClient,
    loadPendingRequests,
    handlePendingRequests,
}