import { PanelLeft, PenBox, Plus } from 'lucide-react';
import { useState } from 'react';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="fixed inset-y-0 left-0 z-50 h-screen w-67.5 shrink-0 border-r border-white/6 bg-[#0d0f14] lg:static">
      <div className="flex h-full flex-col">
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
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-500 transition-colors duration-150 hover:bg-white/5 hover:text-slate-200">
            <PenBox size={14} />
          </button>
        </div>

        <div className="px-4 pt-4 pb-1">
          <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-linear-to-br from-indigo-500 to-violet-700 py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-80">
            <Plus size={15} />
            New Chat
          </button>
        </div>

        <div className=""></div>
      </div>
    </div>
  );
};

export default SideBar;
