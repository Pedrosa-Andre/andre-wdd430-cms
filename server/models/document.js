const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
});

documentSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Document", documentSchema);
