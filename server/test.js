const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/worque");

const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

(async () => {
  try {
    const res = await Test.create({ name: "CheckWrite" });
    console.log("Write OK:", res);
  } catch (err) {
    console.error("Write failed:", err);
  }
})();
