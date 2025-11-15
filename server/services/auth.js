const jwt=require("jsonwebtoken");
const secret="KUNAL";
const createJwtToken=(user)=>{
    try{
    const token=jwt.sign(user,secret);
    return token;
    }catch(err){
        console.log("error:",err)
    }
}
const verifyToken=(token)=>{
    try{
    if(token===undefined)return {success:false};
    const userObj=jwt.verify(token,secret);
    if(userObj)return {success:true,userObj};
    return {succes:false};
    }catch(err){
        console.log("error:",err)
        return null;
    }
}
module.exports={
    createJwtToken,
    verifyToken,
}