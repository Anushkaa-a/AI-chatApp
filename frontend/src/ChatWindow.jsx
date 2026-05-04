import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-2 opacity-60 select-none">
          <span className="text-4xl"></span>
           <h2 className="text-4xl font-semibold text-white/120">Welcome!</h2>
           <h3 className="text-xl text-white/150 tracking-wide">Ask me anything. I got you 👾</h3>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} text={msg.text} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-white/8 border border-white/10 backdrop-blur-sm
            rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;