import { useState, useEffect } from 'react'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';

const API = "https://ai-chatapp-z17a.onrender.com"

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(uuidv4());
  const [conversations, setConversations] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token")); // 👈 check if already logged in

  // auth headers
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` }
  }

  useEffect(() => {
    if (token) fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    const res = await axios.get(`${API}/api/conversations`, authHeaders);
    setConversations(res.data);
  };

  const loadConversation = async (id) => {
    setConversationId(id);
    const res = await axios.get(`${API}/api/history/${id}`, authHeaders);
    const formatted = res.data.flatMap((m) => [
      { role: "user", text: m.userMessage },
      { role: "ai", text: m.aiReply },
    ]);
    setMessages(formatted);
  };

  const startNewChat = () => {
    setConversationId(uuidv4());
    setMessages([]);
  };

  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMessages([]);
    setConversations([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/chat`, {
        message: input,
        conversationId,
      }, authHeaders);
      setMessages([...newMessages, { role: "ai", text: res.data.reply }]);
      fetchConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 👈 show auth page if not logged in
  if (!token) return <Auth onLogin={handleLogin} />

  return (
    <div className="flex h-screen bg-[#0b0b12] text-white">
      <Sidebar
        conversations={conversations}
        conversationId={conversationId}
        loadConversation={loadConversation}
        startNewChat={startNewChat}
        onLogout={handleLogout} // 👈 pass logout to sidebar
      />
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
