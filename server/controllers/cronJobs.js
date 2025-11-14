const cron=require("node-cron");
const taskModel=require("../models/tasks.js");
const archiveModel=require("../models/archivedtasks.js");

function handleCronJobs(){
    cron.schedule("*/5 * * * *",async()=>{
        try{
            const overdone = await taskModel.find({
            expiresAt:
            {
                $lte:new Date(),
            }
        });
        for(const doc of overdone){
            const archived=await archiveModel.create(doc.toObject());

            const deleteTask=await taskModel.deleteOne({_id:doc._id});

            const del=await userModel.updateMany(
                {
                    current_tasks:doc._id,
                },
                {
                    $pull:{
                        current_tasks:doc._id,
                    }
                }
            );
        }
        console.log("cron running!");
        }
        catch{
            console.error("some problem in cron!");
        }
    })
    }
module.exports={handleCronJobs};