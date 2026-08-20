import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import sendMessage from '../features/sendMessage';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMessage,
  setMessages,
  setAiResponding,
} from '../redux/messagesSlice';
import { createConversation } from '../features/createConversation';
import { updateConversation } from '../features/updateConversation';
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from '../redux/conversationSlice';

const ChatInput = () => {
  const [value, setValue] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Auto');
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isAiResponding } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    const prompt = value.trim();
    if (!prompt || isAiResponding) return;

    let conversation = selectedConversation;

    if (!conversation) {
      const conv = await createConversation();

      if (!conv?._id) {
        console.error('Failed to create conversation');
        return;
      }

      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));

      conversation = conv;
    }

    if (conversation.title === 'New Chat') {
      try {
        const updatedConversation = await updateConversation({
          id: conversation._id,
          title: prompt.slice(0, 40),
        });

        dispatch(
          setConvTitle({
            conversationId: conversation._id,
            title: updatedConversation.title,
          })
        );
      } catch (error) {
        console.error('Failed to update conversation title:', error);
      }
    }

    const payload = {
      prompt,
      conversationId: conversation?._id,
      agent: selectedAgent.toLowerCase(),
    };

    // Add user message immediately
    dispatch(
      addMessage({
        _id: `temp-user-${Date.now()}`,
        conversationId: conversation._id,
        role: 'user',
        content: prompt,
      })
    );

    // Clear input
    setValue('');

    try {
      dispatch(setAiResponding(true));
      const data = await sendMessage(payload);

      console.log(data);

      // Add AI response
      dispatch(
        addMessage({
          _id: `temp-ai-${Date.now()}`,
          conversationId: conversation._id,
          role: 'assistant',
          content: data.answer,
          images: data.images,
        })
      );
      console.log(data);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      dispatch(setAiResponding(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  const agents = [
    {
      id: 'auto',
      icon: Zap,
      label: 'Auto',
    },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    {
      id: 'coding',
      icon: Code2,
      label: 'Coding',
    },
    {
      id: 'pdf',
      icon: FileText,
      label: 'PDF',
    },
    {
      id: 'ppt',
      icon: Presentation,
      label: 'PPT',
    },
    {
      id: 'image',
      icon: ImageIcon,
      label: 'Image',
    },
    {
      id: 'search',
      icon: Globe,
      label: 'Search',
    },
  ];

  return (
    <div className="w-full overflow-hidden border-t border-white/6 bg-[#0d0f14] px-3 py-4 md:px-5">
      <div className="flex flex-col gap-2 rounded-2xl border border-white/7 bg-white/3 px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] flex-wrap gap-2 pr-2">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                onClick={() => setSelectedAgent(agent.label)}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all ${isActive ? 'to-voilet-600 border-transparent bg-linear-to-r from-indigo-500 text-white shadow-[0_1px_8px_rgba(99,102,241,.35)]' : 'border-white/6 bg-white/3 text-slate-400 hover:bg-white/7 '}`}
              >
                <Icon
                  size={14}
                  className={isActive ? 'text-white' : 'text-slate-500'}
                />
                {agent.label}
              </div>
            );
          })}
        </div>
        <textarea
          className="scrollbar:none {&::-webkit-scrollbar]:hidden w-full resize-none bg-transparent text-[14px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600 disabled:opacity-50"
          placeholder="Ask Anything..."
          rows={1}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onKeyDown={handleKeyDown}
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
            disabled={!value.trim() || isAiResponding}
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
