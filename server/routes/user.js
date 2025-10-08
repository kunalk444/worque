const {Router}=require("express");
const {handleSignup,handleLogin}=require("../controllers/user.js")
const {createJwtToken} = require("../services/auth.js")
const userRouter=Router();
userRouter.post("/signup",async(req,res)=>{
    try{
     const {uname,upass,uemail}=req.body;
     console.log(uname,upass,uemail);
     const token=await handleSignup(uname,upass,uemail);
     const cookieToken=createJwtToken(token);
     res.cookie("jwt",cookieToken,{
        httpOnly:true,
        maxAge:24*24*60*100,
        sameSite:"Strict",
        secure:false,

     })
     return res.status(201).json({success:true,message:"signup successful!"});
    }
    catch(err){
        return res.status(400).json({success:false,"error":err})
    }
});
userRouter.post("/login",async(req,res)=>{
    try{
        const {uemail,upass}=req.body;
        console.log(req.body);
        const existingUser= await handleLogin(uemail,upass);
        if(!existingUser)return res.status(400).json({success:false});
        const cookieToken=createJwtToken(existingUser);
        res.cookie("jwt",cookieToken,{
            httpOnly:true,
            maxAge:24*24*60*100,
            sameSite:"Strict",
            secure:false,
        });
        return res.status(201).json({success:true,message:"login successful!",
            user:{uname:existingUser.uname,email:existingUser.email}});

    }catch(err){
        return res.status(400).json({success:false,"error":err});
    }
});
userRouter.post("/logout",(req,res)=>{
    res.cookie("jwt","",{
        maxAge:0,
        httpOnly:true,
        sameSite:"strict",
        secure:false,        
    })
    return res.status(200).json({success:true});
})
module.exports={userRouter};