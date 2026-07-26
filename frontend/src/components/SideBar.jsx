import {
  Coins,
  LogIn,
  LogOut,
  MessageSquare,
  PanelLeft,
  PenBox,
  Plus,
  User,
} from 'lucide-react';
import { useEffect, useReducer, useState } from 'react';
import { getConversations } from '../features/getConversation.js';
import { createConversation } from '../features/createConversation.js';
import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from '../redux/conversationSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import logout from '../features/logout.js';
import { setUserData } from '../redux/userSlice.js';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, []);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 h-screen w-67.5 shrink-0 border-r border-white/6 bg-[#0d0f14] lg:static">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-white/6 px-4 py-4">
          <div
            onClick={() => {
              setCollapsed(true);
            }}
            className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-500 transition-colors duration-150 hover:bg-white/5 hover:text-slate-200 lg:flex"
          >
            <PanelLeft />
          </div>
          <span className="flex-1 text-[16px] font-semibold tracking-tight text-slate-100">
            CortexAI
          </span>
          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-indigo-400">
            free
          </span>
          <button
            onClick={handleCreateConversation}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-500 transition-colors duration-150 hover:bg-white/5 hover:text-slate-200"
          >
            <PenBox size={14} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pt-4 pb-1">
          <button
            onClick={handleCreateConversation}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-indigo-500 to-violet-700 py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-80"
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {/* Conversations */}
        {conversations.length === 0 ? (
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold tracking-widest text-slate-600 uppercase">
            No Recent Conversations
          </div>
        ) : (
          <div className="px-5 pt-4 pb-1.5 text-xs font-semibold tracking-widest text-slate-600 uppercase">
            Recents
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar:none] [&::-webkit-scrollbar]:hidden">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv?._id;
            return (
              <div
                key={i}
                onClick={() => {
                  console.log(conv);
                  dispatch(setSelectedConversation(conv));
                }}
                className={`mb-1 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-150 ${
                  isActive
                    ? 'border-indigo-500/20 bg-indigo-800'
                    : 'hover:bg-indigo-900'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${isActive ? 'bg-gray-900/50 text-gray-200' : 'bg-white/5 text-slate-500'}`}
                >
                  <MessageSquare size={15} />
                </div>
                <span
                  className={`truncate text-[13px] font-medium ${isActive ? 'text-slate-100' : 'text-slate-300'}`}
                >
                  {conv?.title || 'New Chat'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mx-2.5 h-px bg-white/6" />

        {/* UserDetails footer*/}
        <div className="px-3.5 py-3.5">
          {userData ? (
            <div className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-white/5">
              <div className="relative shrink-0">
                {!userData?.avatar || !imageError ? (
                  <img
                    className="h-9 w-9 rounded-[10px] border-2 border-indigo-500/25 object-cover"
                    src={userData.avatar}
                    alt={`${userData.name} avatar`}
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border-2 border-white/6">
                    <User />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-seminbold truncate text-[13.5px] text-slate-100">
                  {userData.name || 'User'}
                </p>
                <p className="mt-px text-[11px] text-slate-600">
                  {'Free Plan'}
                </p>
              </div>
              <div className="flex gap-1">
                <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[7px] border-none bg-transparent text-yellow-600 transition-all duration-150 hover:bg-white/8 hover:text-slate-400">
                  <Coins size={16} />
                </button>
                <button
                  onClick={() => {
                    (logout(), dispatch(setUserData(null)));
                  }}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[7px] border-none bg-transparent text-slate-600 transition-all duration-150 hover:bg-white/8 hover:text-slate-400"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button>
              <LogIn />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
