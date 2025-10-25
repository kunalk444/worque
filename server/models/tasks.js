const mongoose=require("mongoose");
const {addMembers}=require("../services/mail.js");
const userModel=require("../models/user.js");
const pendingRequestsModel=require("../models/pendingrequests.js");
const taskSchema=mongoose.Schema({
    task_priority:{
        type:String,
        required:true
    },
    task_description:{
        type:String,
        required:true
    },
    sub_tasks:{
        type:Array,
    },
    invited_members:{
        type:Array,
    },
    current_members:{
        type:Array,
    },
    admin:{
        type:String,
        required:true,
    }
});
taskSchema.post("save",async function(){
    const task=this;
    const ifEmailAdded=await addMembers(task.invited_members);
    const admin=task.admin;
    console.log(admin);
    if(ifEmailAdded)console.log("emails sent!");
    for(let i=0;i<task.invited_members.length;i++){
        const mail=task.invited_members[i];
        const user=await userModel.findOneAndUpdate({email:mail},{$addToSet:{pending_requests:task._id}},{new:true});
        if(!user){
            const newUser=await pendingRequestsModel.findOneAndUpdate({email:mail},{$addToSet:{requests:task._id}},{upsert:true,new:true});
        }
    }
    const afterTaskUpdate=await this.constructor.updateOne({_id:task._id},{$addToSet:{current_members:admin}},{new:true});
    await userModel.updateOne({email:admin},{$addToSet:{current_tasks:task._id}});
    console.log(afterTaskUpdate);
});
const taskModel=mongoose.model("tasks",taskSchema);
module.exports=taskModel;
