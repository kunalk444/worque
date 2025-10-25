const {Router}=require("express");
const {handleSignup,handleLogin,handleGoogleClient,loadPendingRequests,handlePendingRequests}=require("../controllers/user.js")
const {createJwtToken} = require("../services/auth.js")
const {OAuth2Client} = require("google-auth-library");
const client= new OAuth2Client(process.env.CLIENT_ID);
const userRouter=Router();
userRouter.post("/signup",async(req,res)=>{
    try{
     const {uname,upass,uemail}=req.body;
     const token=await handleSignup(uname,upass,uemail);
     const cookieToken=createJwtToken(token);
     res.cookie("jwt",cookieToken,{
        httpOnly:true,
        maxAge:24*24*60*100,
        sameSite:"Strict",
        secure:false,

     })
     return res.status(201).json({success:true,message:"signup successful!",id:token.id});
    }
    catch(err){
        return res.status(400).json({success:false,"error":err})
    }
});
userRouter.post("/login",async(req,res)=>{
    try{
        const {uemail,upass}=req.body;
        const existingUser= await handleLogin(uemail,upass);
        if(!existingUser)return res.status(400).json({success:false});
        const cookieToken=createJwtToken(existingUser);
        res.cookie("jwt",cookieToken,{
            httpOnly:true,
            maxAge:24*24*60*100,
            sameSite:"Strict",
            secure:false,
        });
        console.log(existingUser.id);
        return res.status(201).json({success:true,message:"login successful!",
            user:{uname:existingUser.uname,email:existingUser.email,id:existingUser.id}});

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
userRouter.post("/googleUser",async(req,res)=>{
    const {token}=req.body;
    try{
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:process.env.CLIENT_ID
        })
        const data=ticket.getPayload();
        if(data.email_verified){
            await handleGoogleClient({uname:data.name,email:data.email});
            const cookieToken=createJwtToken({uname:data.name,email:data.email});
            res.cookie("jwt",cookieToken,{
            httpOnly:true,
            maxAge:24*60*60*100,
            sameSite:"Strict",
            secure:false,
            })
            return res.json({success:true,uname:data.name,email:data.email});
        }
        return res.json({success:false});
    }
    catch(err){
        console.error(err);
        return res.status(401).json({success:false});
    }

});
userRouter.post("/pendingRequests",async(req,res)=>{
    const {email}=req.body;
    const arr=await loadPendingRequests(email);
    return res.json({requests:arr});
});
userRouter.post("/handlependingrequests",async(req,res)=>{
    const {userId,taskId,type}=req.body;
    const obj=await handlePendingRequests(userId,taskId,type);
    if(obj.success)return res.json(obj);
    return res.json({success:false});
})
module.exports={userRouter};