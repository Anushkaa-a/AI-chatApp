import React from 'react';

const InputBar = ({ input, setInput, sendMessage, loading }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="px-4 pb-5 pt-3 border-t border-white/5 bg-[#0b0b12]/90 backdrop-blur-sm">
      <div className="flex items-center gap-3 bg-white/5 border border-white/10
        rounded-2xl px-4 py-2.5 focus-within:border-cyan-500/50 transition-all duration-200">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent text-sm text-white
            placeholder-white/25 outline-none py-0.5"
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="bg-cyan-500 hover:bg-cyan-400 active:scale-95
            disabled:opacity-30 disabled:cursor-not-allowed
            text-white text-sm font-medium px-4 py-1.5 rounded-xl
            transition-all duration-150 shrink-0"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      <p className="text-center text-white/15 text-[11px] mt-2 tracking-wide">
        Press Enter to send
      </p>
    </div>
  );
};

export default InputBar;