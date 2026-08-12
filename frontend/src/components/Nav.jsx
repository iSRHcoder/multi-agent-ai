import { MessageSquare } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

const Nav = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);

  const { messages } = useSelector((state) => state.message);

  return (
    <>
      {selectedConversation && (
        <div className="flex h-14 items-center gap-2.5 border-b border-white/6 bg-[#0d0f14] px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
            <MessageSquare size={13} className="text-indigo-400" />
          </div>

          <div className="text-[14px] font-semibold tracking-tight text-slate-100">
            {/* "min-w-0 flex-1 truncate text-[14px] font-semibold tracking-tight text-slate-100" */}
            {selectedConversation?.title || 'New Chat'}
          </div>

          <div className="rounded-full border border-white/6 bg-white/4 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {messages?.length ?? 0} messages
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
