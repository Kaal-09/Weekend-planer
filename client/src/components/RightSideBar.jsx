import { useEffect, useRef, useState } from "react";
import { Search, Users, ShieldCheck, Check, Plus, X, Send } from "lucide-react";
import { connectWS } from "../utils/ws";
import { useAuthStore } from "../context/useAuth";
import { axiosInstance } from "../utils/axiosInstance";

const chats = [
    { id: 1, name: "Aarav Sharma", message: "Let's plan the trip", time: "2:15 PM", unread: 2, online: true, isGroup: false, color: "bg-amber-100 text-amber-600", usermessage: "Fuck you nigga" },
    { id: 2, name: "Travel Squad", message: "Tickets booked!", time: "1:05 PM", unread: 5, online: false, isGroup: true, color: "bg-blue-100 text-blue-600", usermessage: "Fuck you nigga" },
    { id: 3, name: "Riya Patel", message: "Check this place", time: "Yesterday", unread: 0, online: true, isGroup: false, color: "bg-purple-100 text-purple-600", usermessage: "Fuck you nigga" },
    { id: 4, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 5, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 6, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 7, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 8, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 9, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
    { id: 10, name: "Manali Group", message: "Hotel options?", time: "Mon", unread: 0, online: false, isGroup: true, color: "bg-emerald-100 text-emerald-600", usermessage: "Fuck you nigga" },
];

const ChatSidebar = () => {
    const socket = useRef(null);
    const [activeChat, setActiveChat] = useState(0);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const { userEmail } = useAuthStore();
    const [suggestedUsers, setsuggestedUsers] = useState([]);
    const [debounceQuery, setdebounceQuery] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [friendsArray, setfriendsArray] = useState([]);
    let count = 0;

    useEffect(() => {
        const fetchLeanUser = async () => {
            if (!userEmail) return;
            try {
                const res = await axiosInstance.get(`/user/getleanuserByEmail/${userEmail}`);
                if (res.data && res.data.user) {
                    const leanUser = res.data.user;
                    console.log('Lean user inside chatSidebar:', leanUser);
                    setUser(leanUser);
                    setfriendsArray(leanUser.friends)
                }
            } catch (error) {
                if (error.response) {
                    console.error('Server Error:', error.response.data.message || 'Could not fetch user');
                } else if (error.request) {
                    console.error('Network Error: No response from server. Check your connection.');
                } else {
                    console.error('Error:', error.message);
                }
            }
        };
        fetchLeanUser();
    }, [userEmail, count]);

    useEffect(() => {
        socket.current = connectWS();

        socket.current.on("connect", () => {
            console.log('Frontent connected to socket');
            socket.current.emit('joinRoom', chats[0].name);
        })
    }, []);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setdebounceQuery(query);
            console.log(query);
        }, 1300);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (!debounceQuery?.trim()) {
            setsuggestedUsers([]);
            return;
        }
        const controller = new AbortController();

        const fetchUsers = async () => {
            try {
                setError(null);
                const res = await axiosInstance.get(
                    `/user/getSuggestedUsersMatchingPrefix/${debounceQuery}`,
                    {
                        signal: controller.signal
                    }
                );
                setsuggestedUsers(res.data.users);
            } catch (err) {
                if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
                    return;
                }
                console.error(err);
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        return () => {
            controller.abort();
        };
    }, [debounceQuery]);

    const handleAddFriend = async (userId) => {
        try {
            await axiosInstance.post(
                `/user/addUserById/${userId}`
            );
            count++;
            
        } catch (err) {
            console.error(err);
            setError("Failed toadd friend a user");
        }
    }

    return (
        <aside
            className={`h-full bg-white/80 backdrop-blur-xl border-l border-gray-200/60 flex transition-all duration-500 ease-in-out shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${activeChat ? "w-137.5" : "w-80"
                }`}
        >
            <div className="w-80 shrink-0 flex flex-col border-r border-gray-100">
                <div className="p-6 pb-4">
                    <div className="mb-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">Messages</h2>
                            <button
                                onClick={() => setShowSearch(prev => !prev)}
                                className={`p-2 rounded-full transition-all duration-300 ${showSearch ? 'bg-stone-100 rotate-45' : 'hover:bg-stone-100'
                                    }`}
                            >
                                <Plus size={20} className={showSearch ? 'text-stone-600' : 'text-stone-400'} />
                            </button>
                        </div>

                        {/* Search Container */}
                        <div className={`relative overflow-visible transition-all duration-300 ease-in-out ${showSearch ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                            }`}>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search by username or email..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-4 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400 focus:bg-white transition-all text-sm"
                                />

                                {/* Combined Dropdown for Loading, Error, and Results */}
                                {query.length > 0 && (loading || error || suggestedUsers.length > 0) && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden">

                                        {/* 1. Loading State */}
                                        {loading && (
                                            <div className="p-4 flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
                                                <p className="text-xs text-stone-500 font-medium">Searching explorers...</p>
                                            </div>
                                        )}

                                        {/* 2. Error State */}
                                        {error && !loading && (
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-red-500 bg-red-50 py-2 rounded-lg">{error}</p>
                                            </div>
                                        )}

                                        {/* 3. Results List */}
                                        {!loading && !error && suggestedUsers.length > 0 && (
                                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                {suggestedUsers.map((u) => (
                                                    <div
                                                        key={u._id}
                                                        className="flex items-center justify-between p-3 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-none"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
                                                                {u.profilePic ? (
                                                                    <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-stone-500">
                                                                        {u.userName.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-stone-800">{u.userName}</span>
                                                                <span className="text-[10px] text-stone-400">{u.email}</span>
                                                            </div>
                                                        </div>

                                                        {friendsArray.includes(u._id) ? (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 text-stone-500 text-[11px] font-bold rounded-lg cursor-default">
        <Check size={12} />
        Friend
    </div>
) : (
    <button 
        onClick={() => handleAddFriend(u._id)}
        className="px-3 py-1.5 bg-stone-900 text-white text-[11px] font-bold rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-1"
    >
        <Plus size={12} />
        Add
    </button>
)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
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