
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const Message = require("./models/Message");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("DB error:", err));


// console.log("key:", process.env.OPENROUTER_API_KEY.length);

const {GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new 
   GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res)=>{
    res.send("server is running ");
});

app.post("/api/chat", async (req, res) => {
  const { message: userMsg, conversationId } = req.body;

  try {
    // fetch previous messages from DB
    const history = await Message.find({ 
  conversationId 
}).sort({ createdAt: 1 }).limit(20);

    // format them for the AI
    const pastMessages = history.flatMap((m) => [
      { role: "user", content: m.userMessage },
      { role: "assistant", content: m.aiReply },
    ]);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          ...pastMessages,          // 👈 all previous messages
          { role: "user", content: userMsg },  // 👈 current message
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "chatbot",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // save to DB
    await Message.create({
        conversationId, 
         userMessage: userMsg, 
         aiReply });

    res.json({ reply: aiReply });

  } catch (err) {
    console.error("full err:", err);
    res.status(500).json({ error: "AI failed!" });
  }
});

app.get("/api/history/:id", async (req, res) => {
  const history = await Message.find({ 
    conversationId: req.params.id  // 👈 filter by the id
  }).sort({ createdAt: 1 });
  res.json(history);
});

app.get("/api/conversations", async (req, res) => {
  const convos = await Message.aggregate([
    { $group: { _id: "$conversationId", createdAt: { $first: "$createdAt" }, firstMessage: { $first: "$userMessage" } } },
    { $sort: { createdAt: -1 } }
  ]);
  res.json(convos);
});

app.listen(5000, ()=>{
    console.log("server running")
}); 
