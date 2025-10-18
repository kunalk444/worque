const mongoose=require("mongoose");
const crypto=require("crypto");
const userSchema=mongoose.Schema({
    uname:{
        type:String,
        required:true,
    },
    password:{
        type:String,

    },
    email:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    pending_requests:{
        type:Array,
    },
    current_tasks:{
        type:Array,
    }
});
userSchema.pre("save",async function(next){
    const user=this;
    if(!user.isModified("password"))return next();
    const salt=crypto.randomBytes(16).toString();
    const hMacedPassword=crypto.createHmac("sha256",salt)
                                .update(user.password)
                                .digest("hex");
    this.salt=salt;
    this.password=hMacedPassword;
    next();
})
const userModel=mongoose.model("User",userSchema);
module.exports=userModel;