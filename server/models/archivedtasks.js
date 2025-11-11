const mongoose=require("mongoose");

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

// archiveSchema.post("save",async()=>{

// });

const archiveModel=mongoose.model("archivedtasks",archiveSchema);

console.log("model called at:",new Date().toString());
module.exports=archiveModel;