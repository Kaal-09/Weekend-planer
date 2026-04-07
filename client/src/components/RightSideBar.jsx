import { useState } from "react";
import { Search, Users, ShieldCheck, Plus, X, Send } from "lucide-react";

const chats = [
    { id: 1, name: "Aarav Sharma", message: "Let’s plan the trip", time: "2:15 PM", unread: 2, online: true, isGroup: false, color: "bg-amber-100 text-amber-600" , usermessage: "Fuck you nigga" },
    { id: 2, name: "Travel Squad", message: "Tickets booked!", time: "1:05 PM", unread: 5, online: false, isGroup: true, color: "bg-blue-100 text-blue-600" , usermessage: "Fuck you nigga" },
    { id: 3, name: "Riya Patel", message: "Check this place", time: "Yesterday", unread: 0, online: true, isGroup: false, color: "bg-purple-100 text-purple-600" , usermessage: "Fuck you nigga" },
    { id: 4, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 5, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" , usermessage: "Fuck you nigga" },
    { id: 6, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" , usermessage: "Fuck you nigga" },
    { id: 7, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" , usermessage: "Fuck you nigga" },
    { id: 8, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" , usermessage: "Fuck you nigga" },
    { id: 9, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" , usermessage: "Fuck you nigga" },
    { id: 10, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600" , usermessage: "Fuck you nigga" },
];

const ChatSidebar = () => {
    const [activeChat, setActiveChat] = useState(0);

    return (
        <aside
            className={`h-full bg-white/80 backdrop-blur-xl border-l border-gray-200/60 flex transition-all duration-500 ease-in-out shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${activeChat ? "w-137.5" : "w-80"
                }`}
        >
            <div className="w-80 shrink-0 flex flex-col border-r border-gray-100">
                <div className="p-6 pb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900">Messages</h2>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Plus size={20} className="text-gray-400" /></button>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full bg-gray-100/50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none focus:bg-white" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`relative flex items-center gap-3 px-3 py-3.5 rounded-2xl cursor-pointer transition-all ${activeChat === chat.id
                                ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100"
                                : "hover:bg-gray-50 border border-transparent"
                                }`}
                        >
                            {activeChat === chat.id && (
                                <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full shadow-[2px_0_8px_rgba(59,130,246,0.4)]" />
                            )}

                            <div className="relative shrink-0">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${chat.color}`}>
                                {chat.isGroup ? <Users size={18} /> : chat.name[0]}
                            </div>

                            {!chat.isGroup && chat.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm">
                                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25"></span>
                                </span>
                            )}
                        </div>
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
                                    <div className="bg-blue-600 text-white text-[10px] min-w-4.5 h-4.5 flex items-center justify-center px-1.5 rounded-full font-bold shadow-md shadow-blue-200">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeChat && (
                <div className="flex-1 flex flex-col bg-white animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${chats[activeChat - 1].color}`}>
                                {chats[activeChat - 1].isGroup ? <Users size={18} /> : chats[activeChat - 1].name[0]}
                            </div>
                            <span className="font-bold text-sm text-gray-800">{chats[activeChat - 1].name}</span>
                        </div>
                        <button onClick={() => setActiveChat(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>

                    {/* MESSAGES AREA */}
                    <div className="flex-1 p-4 bg-gray-50/50 overflow-y-auto space-y-4">

                        {/* 1. Received Message (Other User) */}
                        {chats[activeChat - 1].usermessage && (
                            <div className="bg-white border border-gray-100 text-gray-700 p-3 rounded-2xl rounded-tl-none mr-auto max-w-[80%] text-sm shadow-sm">
                                {chats[activeChat - 1].usermessage}
                            </div>
                        )}

                        {/* 2. Sent Message (Current User) */}
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[80%] text-sm shadow-md shadow-blue-100">
                            {chats[activeChat - 1].message}
                        </div>

                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
                            <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-sm px-2" />
                            <button className="text-blue-600"><Send size={18} /></button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};


export default ChatSidebar;