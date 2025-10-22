const mongoose=require("mongoose");
const pendingRequestsSchema=mongoose.Schema({
    email:{
        type:String,
    },
    requests:{
        type:Array,
    }
});
const pendingRequestsModel=mongoose.model("pending_requests",pendingRequestsSchema);
module.exports= pendingRequestsModel;
