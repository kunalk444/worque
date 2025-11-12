const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/worque");
const archiveModel=require("./models/archivedtasks.js");

(async () => {
  try {
    const res = await archiveModel.create({
      task_priority: 'today',
      task_description: 'sdfg',
      admin: 'kanjwanikunal45@gmail.com',
      expiresAt:new Date(Date.now()+24*3600*1000)
    });
    console.log("done:", res);
  } catch (err) {
    console.error("failed:", err);
  }
})();
