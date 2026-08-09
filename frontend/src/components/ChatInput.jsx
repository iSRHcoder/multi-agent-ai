import { Mic, Paperclip, Send } from 'lucide-react';
import React, { useState } from 'react';
import sendMessage from '../features/sendMessage';
import { useSelector } from 'react-redux';

const ChatInput = () => {
  const [value, setValue] = useState('');
  const { selectedConversation } = useSelector((state) => state.conversation);

  const handleSendMessage = async () => {
    const payload = {
      prompt: value.trim(),
      conversationId: selectedConversation._id,
    };
    const data = await sendMessage(payload);
    console.log(data);
  };
  return (
    <div className="w-full overflow-hidden border-t border-white/6 bg-[#0d0f14] px-3 py-4 md:px-5">
      <div className="flex flex-col gap-2 rounded-2xl border border-white/7 bg-white/3 px-4 pt-3.5 pb-3">
        <textarea
          className="scrollbar:none {&::-webkit-scrollbar]:hidden w-full resize-none bg-transparent text-[14px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600 disabled:opacity-50"
          placeholder="Ask Anything..."
          rows={3}
          onChange={(e) => setValue(e.target.value)}
          value={value.trim()}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-600 transition-all duration-150 hover:border-white/6 hover:bg-white/5 hover:text-slate-400">
              <Paperclip size={16} />
            </button>
            <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-600 transition-all duration-150 hover:border-white/6 hover:bg-white/5 hover:text-slate-400">
              <Mic size={16} />
            </button>
          </div>
          <button
            disabled={!value}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border-none transition-all duration-150 ${
              value.trim()
                ? 'cursor-pointer bg-linear-to-br from-indigo-500 to-violet-700 text-white hover:opacity-80'
                : 'cursor-not-allowed bg-white/5 text-slate-600'
            }`}
            onClick={handleSendMessage}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
