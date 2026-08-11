import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';

const MessageList = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);

  const { messages } = useSelector((state) => state.message);

  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check whether user is at the bottom
  const checkScrollPosition = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    // Show button if user is more than 100px away from bottom
    setShowScrollButton(distanceFromBottom > 100);
  };

  // Scroll to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });

    setShowScrollButton(false);
  };

  // Automatically go to last message
  // whenever conversation/messages change
  useEffect(() => {
    if (!selectedConversation || messages.length === 0) return;

    // Small delay makes sure the DOM has rendered the messages
    requestAnimationFrame(() => {
      scrollToBottom('auto');
    });
  }, [selectedConversation, messages]);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Messages scroll area */}
      <div
        ref={messagesContainerRef}
        onScroll={checkScrollPosition}
        className="h-full scrollbar-none space-y-5 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden"
      >
        {messages.length === 0 || !selectedConversation ? (
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
              ].map((s) => (
                <button
                  key={s}
                  className="cursor-pointer rounded-lg border border-white/7 bg-white/4 px-3 py-1.5 text-[12px] text-slate-400 transition-colors duration-150 hover:bg-white/8 hover:text-slate-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                role={msg.role}
                content={msg.content}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom('smooth')}
          aria-label="Scroll to latest message"
          className="absolute bottom-5 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-800/90 text-slate-300 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:text-white"
        >
          <ChevronDown size={18} />
        </button>
      )}
    </div>
  );
};

export default MessageList;
