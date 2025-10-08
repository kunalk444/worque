const {Router}=require("express");
const authRouter=Router();
const userModel=require("../models/user")
const {verifyToken}=require("../services/auth.js")
authRouter.post("/verifytoken",async(req,res)=>{
    if(!req.cookies)return res.json({success:false});
    const token=req.cookies.jwt;
    const userObj=verifyToken(token);
    return res.status(200).json({success:true,uname:userObj.uname,email:userObj.email});
});
module.exports={
    authRouter,
}