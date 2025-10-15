const mongoose=require("mongoose");
const {addMembers}=require("../controllers/tasks.js");
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
    }
});
taskSchema.post("save",async function(){
    const user=this;
    const ifEmailAdded=await addMembers(user.invited_members);
    console.log(user.invited_members);
    if(ifEmailAdded)console.log("emails sent!");

});
const taskModel=mongoose.model("tasks",taskSchema);
module.exports=taskModel;
