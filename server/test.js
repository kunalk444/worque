const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/worque");
const archiveModel=require("./models/archivedtasks.js");
const userModel=require("./models/user.js");

(async () => {
  try {
    const res = await archiveModel.find({},{_id:1});

    for(const obj of res){
      const id=obj._id;
      const del=await userModel.updateMany(
        {

        },
        {
          $pull:{
            current_tasks:id,
          }
        }
      );
    
    }
  } catch (err) {
    console.error("failed:", err);
  }
})();
