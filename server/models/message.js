const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  id: { type: String, required: true },
  subject: { type: String },
  msgText: { type: String, required: true },
  sender: { type: String, required: true },
});

messageSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Message", messageSchema);
