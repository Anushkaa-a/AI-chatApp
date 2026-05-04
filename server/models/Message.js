const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: String,
  userMessage: String,
  aiReply: String,
}, { timestamps: true });   // timestamps auto-adds createdAt

module.exports = mongoose.model("Message", messageSchema);