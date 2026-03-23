import {
  LayoutDashboard, Shield, Telescope, Gamepad2,
  Users, Timer, BookOpen, Radio, MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard'         },
  { id: 'guardian',  Icon: Shield,          label: 'Guardian AI'       },
  { id: 'regret',    Icon: Telescope,       label: 'Regret Simulator'  },
  { id: 'life',      Icon: Gamepad2,        label: 'Life Impact'       },
  { id: 'crowd',     Icon: Users,           label: 'Crowd vs Smart'    },
  { id: 'wait',      Icon: Timer,           label: 'Wait Power'        },
  { id: 'memory',    Icon: BookOpen,        label: 'Mistake Memory'    },
  { id: 'feed',      Icon: Radio,           label: 'Daily Feed'        },
  { id: 'chat',      Icon: MessageCircle,   label: 'AI Chat'           },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { activePage, setActivePage } = useApp();

  const handleNav = (id) => {
    setActivePage(id);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        w-64 bg-[#0a0a0a] border-r border-white/[0.06]
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-sm select-none">
            TC
          </div>
          <div>
            <p className="font-semibold text-white text-sm tracking-wide">TrendCaster</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">AI Financial Layer</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 text-left cursor-pointer group
                ${activePage === id
                  ? 'bg-white/[0.08] text-white border-l-2 border-white pl-[10px]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                }
              `}
            >
              <Icon
                size={16}
                strokeWidth={activePage === id ? 2 : 1.5}
                className={`shrink-0 transition-all ${activePage === id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}
              />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-white/20">v1.0 · Market data simulated</p>
        </div>
      </aside>
    </>
  );
}
