import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';

const MessageList = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  return (
    <div className="flex-1 scrollbar-none space-y-5 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden">
      {messages.length == 0 || !selectedConversation ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold tracking-tight text-slate-200">
              CortexAI
            </h1>
            <p className="text-[15px] font-semibold tracking-tight text-slate-200">
              How can I help you?
            </p>
            <p className="max-w-65 text-[13px] leading-relaxed text-slate-600">
              Ask me anything - code, ideas, explanations, or just a quick
              question.
            </p>
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {[
              'Create a Netflix Clone',
              'Explain Photosynthesis',
              'Build a Architect Plan',
            ].map((s) => {
              return (
                <button
                  key={s}
                  className="cursor-pointer rounded-lg border border-white/7 bg-white/4 px-3 py-1.5 text-[12px] text-slate-400 transition-colors duration-150 hover:bg-white/8 hover:text-slate-200"
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="">
          {messages.map((msg, i) => (
            <div>
              <MessageBubble key={i} role={msg?.role} content={msg?.content} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
