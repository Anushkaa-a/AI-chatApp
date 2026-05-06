import { useState, useEffect } from 'react'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';  // 👈 add this
import ChatWindow from './ChatWindow';
import InputBar from './InputBar';
import Sidebar from './Sidebar'

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(uuidv4());  // 👈 current chat ID
  const [conversations, setConversations] = useState([]);  // 👈 sidebar list

  // load sidebar conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await axios.get("https://ai-chatapp-z17a.onrender.com/api/conversations");
    setConversations(res.data);
  };

  // load messages when switching chats
 const loadConversation = async (id) => {
  console.log("clicked id:", id) // is it even firing?
  setConversationId(id);
  const res = await axios.get(`https://ai-chatapp-z17a.onrender.com/api/history/${id}`);
  console.log("history response:", res.data) // what's coming back?
  const formatted = res.data.flatMap((m) => [
    { role: "user", text: m.userMessage },
    { role: "ai", text: m.aiReply },
  ]);
  console.log("formatted messages:", formatted) // is it formatted right?
  setMessages(formatted);
};

  // new chat
  const startNewChat = () => {
    setConversationId(uuidv4());
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://ai-chatapp-z17a.onrender.com/api/chat", {
        message: input,
        conversationId,   // 👈 send it to backend
      });
      setMessages([...newMessages, { role: "ai", text: res.data.reply }]);
      fetchConversations();  // 👈 refresh sidebar after each message
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0b12] text-white">
          
         <Sidebar
            conversations={conversations}
            conversationId={conversationId}
            loadConversation={loadConversation}
            startNewChat={startNewChat}
          />
    

      {/* main chat */}
      <div className="flex flex-col flex-1">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <span className="text-xl">✦</span>
          <h1 className="text-base font-semibold tracking-widest text-cyan-400 uppercase">AskAI</h1>
        </div>
        <ChatWindow messages={messages} loading={loading} />
        <InputBar input={input} sendMessage={sendMessage} setInput={setInput} loading={loading} />
      </div>

    </div>
  );
}

export default App;
