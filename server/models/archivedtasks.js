const mongoose=require("mongoose");
const userModel=require("../models/user.js");
const archiveSchema=mongoose.Schema({
     task_priority:{
        type:String,
        required:true
    },
    task_description:{
        type:String,
        required:true
    },
    sub_tasks:{
        type:Map,
        of:String,
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
    },
    completed_subtasks:{
        type:Array,
    },
    chats:{
        type:[
            {
                type:Object,
            }
        ]
    },
    expiresAt:{
        type:Date,
    }

},
{
    toJSON:{
        transform:(doc,ans)=>{
            if(ans.sub_tasks && ans.sub_tasks instanceof Map){
                ans.sub_tasks=Object.fromEntries(ans.sub_tasks);
            }
            else if(ans.sub_tasks && ans.sub_tasks.entries==="function"){
                ans.sub_tasks=Object.fromEntries(ans.sub_tasks.entries());
            } 
            return ans;
        }
    }
});
archiveSchema.pre("save",async function(next){
    this.expiresAt=new Date(Date.now()+24*3600*1000);
    next();
})
archiveSchema.post("save",async function(){
    const task=this;
    const admin=task.admin;
    const obj={
        notiftype:"archived_task",
        taskId:task._id,
        desc:`Task :${task.task_description} is archived! Click to bring it back`,
        timeStamp:Date.now(),
    }
    const res=await userModel.findOneAndUpdate(
        {
            email:admin
        },
        {
            $push:{
                notifications:obj,
            }
        }
    );


});

const archiveModel=mongoose.model("archivedtasks",archiveSchema);

module.exports=archiveModel;