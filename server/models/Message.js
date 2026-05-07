const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  conversationId: { type: String, required: true },
  userMessage: { type: String, required: true },
  aiReply: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema)