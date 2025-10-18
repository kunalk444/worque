const mongoose=require("mongoose");
const {addMembers}=require("../services/mail.js");
const userSchema=require("../models/user.js");
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
    }
});
taskSchema.post("save",async function(){
    const task=this;
    const ifEmailAdded=await addMembers(task.invited_members);
    console.log(task.invited_members);
    if(ifEmailAdded)console.log("emails sent!");
    for(let i=0;i<task.invited_members.length;i++){
        const mail=task.invited_members[i];
        const user=await userSchema.findOneAndUpdate({email:mail},{$push:{pending_requests:task._id}},{new:true});
        console.log(user);
    }

});
const taskModel=mongoose.model("tasks",taskSchema);
module.exports=taskModel;
