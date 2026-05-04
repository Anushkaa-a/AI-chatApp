import { motion } from "framer-motion"

function Sidebar({ conversations, conversationId, loadConversation, startNewChat }) {
  return (
    <div className="w-64 border-r border-white/5 flex flex-col p-3 gap-2">
      <button
        onClick={startNewChat}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-white text-sm 
        font-medium py-2 rounded-xl transition-all"
      >
        + New Chat
      </button>

      <div className="flex flex-col gap-1 overflow-y-auto mt-2">
        {conversations.map((c) => (
          <motion.button
            key={c._id}
            onClick={() => loadConversation(c._id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left text-sm px-3 py-2 rounded-lg truncate transition-all
              ${conversationId === c._id
                ? "bg-white/10 text-white"
                : "text-white/40 hover:bg-white/5 hover:text-white/70"
              }`}
          >
            {c.firstMessage}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar