const mongoose=require("mongoose");
const pendingRequestsSchema=mongoose.Schema({
    email:{
        type:String,
    },
    requests:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"tasks"         
            }
        ],
});
pendingRequestsSchema.index({requests:1});
const pendingRequestsModel=mongoose.model("pending_requests",pendingRequestsSchema);
module.exports= pendingRequestsModel;
