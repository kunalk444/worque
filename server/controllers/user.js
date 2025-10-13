const mongoose=require("mongoose");
const userModel=require("../models/user.js")
const crypto=require("crypto")
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
    console.log(user);
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
module.exports={
    handleSignup,
    handleLogin,
    handleGoogleClient
}