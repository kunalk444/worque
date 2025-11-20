const nodemailer=require("nodemailer");
 
 const addMembers=async(emails,desc)=>{
    const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"kanjwanikunal43@gmail.com",
        pass:"eeuq otdu somn ckuf"
        }
    });
    emails && emails.forEach(element => {
        (async()=>{
            const msg=await transporter.sendMail({
            from:'"Kunal Kanjwani"<kanjwanikunal43@gmail.com>',
            to:element,
            subject:"From Worque:",
            html: `
                <div style="font-family:Arial,sans-serif; padding:20px; background:#f8fafc; border-radius:12px; max-width:500px;">
                    <h2 style="color:#14b8a6;">You've been invited to a Worque task!</h2>
                    <p><strong>Description:</strong> ${desc}</p>
                    <br>
                    <a href="http://localhost:5173" 
                        style="background:#14b8a6; color:white; padding:14px 28px; text-decoration:none; border-radius:50px; font-weight:bold;">
                        Open Worque
                    </a>
                    <br><br>
                    <small>Team Worque • ${new Date().toLocaleDateString()}</small>
                </div>`
        });
    })();    
    });
    return true;
}
module.exports={addMembers};