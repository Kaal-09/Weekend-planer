import { useState } from "react";
import { Search, Users, ShieldCheck, Plus } from "lucide-react";

const chats = [
  { id: 1, name: "Aarav Sharma", message: "Let’s plan the trip", time: "2:15 PM", unread: 2, online: true, isGroup: false, color: "bg-amber-100 text-amber-600" },
  { id: 2, name: "Travel Squad", message: "Tickets booked!", time: "1:05 PM", unread: 5, online: false, isGroup: true, color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "Riya Patel", message: "Check this place", time: "Yesterday", unread: 0, online: true, isGroup: false, color: "bg-purple-100 text-purple-600" },
  { id: 4, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
  { id: 5, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
  { id: 6, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
  { id: 7, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
  { id: 8, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
  { id: 9, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
  { id: 10, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" },
];

const ChatSidebar = () => {
  const [activeChat, setActiveChat] = useState(1);

  return (
    <aside className="fixed right-0 top-17 h-[87vh] w-80 bg-white/80 backdrop-blur-xl border-l border-gray-200/60 flex flex-col z-50 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
      
      {/* HEADER */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <Plus size={20} className="text-gray-400 group-hover:text-blue-600" />
          </button>
        </div>

        {/* REFINED SEARCH (LIGHT) */}
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-gray-100/50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`group relative flex items-center gap-3 px-3 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
              activeChat === chat.id
                ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100"
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            {/* ACTIVE INDICATOR */}
            {activeChat === chat.id && (
              <div className="absolute -left-1 w-1.5 h-6 bg-blue-500 rounded-full shadow-[2px_0_8px_rgba(59,130,246,0.4)]" />
            )}

            {/* AVATAR */}
            <div className="relative shrink-0">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${chat.color}`}>
                {chat.isGroup ? <Users size={18} /> : chat.name[0]}
              </div>

              {/* Online indicator */}
              {!chat.isGroup && chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm">
                   <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25"></span>
                </span>
              )}
            </div>

            {/* CHAT INFO */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`text-[13px] font-bold truncate transition-colors ${activeChat === chat.id ? 'text-gray-900' : 'text-gray-700'}`}>
                  {chat.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {chat.time}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className={`text-[12px] truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {chat.message}
                </p>
                
                {chat.unread > 0 && (
                  <div className="bg-blue-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center px-1.5 rounded-full font-bold shadow-md shadow-blue-200">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-6 mt-auto">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span className="text-[11px] text-gray-500 font-semibold tracking-tight">
            End-to-end encrypted
          </span>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;