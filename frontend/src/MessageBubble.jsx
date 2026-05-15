import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ text, role }) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30
          flex items-center justify-center text-xs text-gray-400 mr-2 mt-1 shrink-0">
          
        </div>
      )}

      <div className={`max-w-[72%] px-4 py-3 text-sm leading-relaxed rounded-2xl
        ${isUser
          ? 'bg-gray-600 text-white rounded-br-sm shadow-lg shadow-cyan-500/20'
          : 'bg-white/8 border border-white/10 backdrop-blur-sm text-gray-200 rounded-bl-sm'
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
};

export default MessageBubble;