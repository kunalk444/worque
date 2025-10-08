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
    if(token===undefined)return null;
    const userObj=jwt.verify(token,secret);
    return userObj;
    }catch(err){
        console.log("error:",err)
        return null;
    }
}
module.exports={
    createJwtToken,
    verifyToken,
}