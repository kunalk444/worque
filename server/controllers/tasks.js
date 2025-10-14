const express=require("express");
const nodemailer=require("nodemailer");
const addMembers=async(emails)=>{
    const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"kanjwanikunal43@gmail.com",
        pass:"eeuq otdu somn ckuf"
        }
    });
    emails.forEach(element => {
        (async()=>{
            const msg=await transporter.sendMail({
            from:'"Kunal Kanjwani"<kanjwanikunal43@gmail.com>',
            to:element,
            subject:"join our project!",
            text:"yo!"
        });
    })();    
    });
    return true;
}
module.exports={
    addMembers
}