import { useEffect, useRef, useState, useCallback } from "react";
import { Search, Users, Check, Plus, X, Send } from "lucide-react";
import { connectWS } from "../utils/ws";
import { useAuthStore } from "../context/useAuth";
import { axiosInstance } from "../utils/axiosInstance";

const ChatSidebar = () => {
    const socket = useRef(null);
    const messagesEndRef = useRef(null);
    const [activeChat, setActiveChat] = useState(null);
    const activeChatRef = useRef(null);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const { userEmail } = useAuthStore();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [debounceQuery, setDebounceQuery] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [friendsArray, setFriendsArray] = useState([]);
    const [messages, setMessages] = useState([]);
    const [msgInput, setMsgInput] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);

    useEffect(() => {
        const fetchLeanUser = async () => {
            if (!userEmail) return;
            try {
                const res = await axiosInstance.get(`/user/getleanuserByEmail/${userEmail}`);
                if (res.data?.user) {
                    setUser(res.data.user);
                    const res2 = await axiosInstance.get('/user/friends');
                    setFriendsArray(res2.data.friends);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchLeanUser();
    }, [userEmail]);

    useEffect(() => {
        if (!user?._id) return;
        socket.current = connectWS(user._id); 

        socket.current.on("newMessage", (message) => {
            const chat = activeChatRef.current;
            setMessages(prev => {
                const isRelevant =
                    (message.sender === chat?._id) ||
                    (message.receiver === chat?._id);
                return isRelevant ? [...prev, message] : prev;
            });
        });

        return () => socket.current?.disconnect();
    }, [user?._id]);

    useEffect(() => {
        if (!activeChat) { setMessages([]); return; }
        const loadMessages = async () => {
            try {
                const res = await axiosInstance.get(`/message/${activeChat._id}`);
                setMessages(res.data.messages);
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };
        loadMessages();
    }, [activeChat]);
    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setDebounceQuery(query), 1300);
        return () => clearTimeout(timeout);
    }, [query]);

    // Fetch suggested users
    useEffect(() => {
        if (!debounceQuery?.trim()) { setSuggestedUsers([]); setLoading(false); return; }
        const controller = new AbortController();
        const fetchUsers = async () => {
            try {
                setError(null);
                const res = await axiosInstance.get(
                    `/user/getSuggestedUsersMatchingPrefix/${debounceQuery}`,
                    { signal: controller.signal }
                );
                setSuggestedUsers(res.data.users);
            } catch (err) {
                if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        return () => controller.abort();
    }, [debounceQuery]);

    const handleAddFriend = async (userId) => {
        try {
            await axiosInstance.post(`/user/addUserById/${userId}`);
            const res2 = await axiosInstance.get('/user/friends');
            setFriendsArray(res2.data.friends);
        } catch (err) {
            setError("Failed to add friend");
        }
    };

    const handleSendMessage = async () => {
        if (!msgInput.trim() || !activeChat || sendingMsg) return;
        setSendingMsg(true);
        try {
            const res = await axiosInstance.post(`/message/send/${activeChat._id}`, {
                content: msgInput.trim()
            });
            const newMsg = res.data.message;
            setMessages(prev => [...prev, newMsg]);
            socket.current?.emit('sendMessage', {
                receiverId: activeChat._id,
                message: newMsg,
            });
            setMsgInput("");
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSendingMsg(false);
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <aside className={`h-full bg-white/80 backdrop-blur-xl border-l border-gray-200/60 flex transition-all duration-500 ease-in-out shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${activeChat ? "w-137.5" : "w-80"}`}>
            <div className="w-80 shrink-0 flex flex-col border-r border-gray-100">
                <div className="p-6 pb-4">
                    <div className="mb-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">Messages</h2>
                            <button
                                onClick={() => setShowSearch(prev => !prev)}
                                className={`p-2 rounded-full transition-all duration-300 ${showSearch ? 'bg-stone-100 rotate-45' : 'hover:bg-stone-100'}`}
                            >
                                <Plus size={20} className={showSearch ? 'text-stone-600' : 'text-stone-400'} />
                            </button>
                        </div>

                        <div className={`relative overflow-visible transition-all duration-300 ease-in-out ${showSearch ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search by username or email..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-4 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400 focus:bg-white transition-all text-sm"
                                />
                                {query.length > 0 && (loading || error || suggestedUsers.length > 0) && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden">
                                        {loading && (
                                            <div className="p-4 flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
                                                <p className="text-xs text-stone-500 font-medium">Searching...</p>
                                            </div>
                                        )}
                                        {error && !loading && (
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-red-500 bg-red-50 py-2 rounded-lg">{error}</p>
                                            </div>
                                        )}
                                        {!loading && !error && suggestedUsers.length > 0 && (
                                            <div className="max-h-60 overflow-y-auto">
                                                {suggestedUsers.map((u) => (
                                                    <div key={u._id} className="flex items-center justify-between p-3 hover:bg-stone-50 border-b border-stone-50 last:border-none">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
                                                                {u.profilePic
                                                                    ? <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                                                                    : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-stone-500">{u.userName.charAt(0)}</div>
                                                                }
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-stone-800">{u.userName}</span>
                                                                <span className="text-[10px] text-stone-400">{u.email}</span>
                                                            </div>
                                                        </div>
                                                        {friendsArray.some(f => f._id === u._id) ? (
                                                            <div className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 text-stone-500 text-[11px] font-bold rounded-lg cursor-default">
                                                                <Check size={12} /> Friend
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleAddFriend(u._id)} className="px-3 py-1.5 bg-stone-900 text-white text-[11px] font-bold rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-1">
                                                                <Plus size={12} /> Add
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

                {/* Friends list */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {friendsArray.map((friend) => (
                        <div
                            key={friend._id}
                            onClick={() => setActiveChat(friend)}
                            className={`relative flex items-center gap-3 px-3 py-3.5 rounded-2xl cursor-pointer transition-all ${activeChat?._id === friend._id
                                ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100"
                                : "hover:bg-gray-50 border border-transparent"}`}
                        >
                            {activeChat?._id === friend._id && (
                                <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full shadow-[2px_0_8px_rgba(59,130,246,0.4)]" />
                            )}
                            <div className="relative shrink-0">
                                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                    {friend.profilePic
                                        ? <img src={friend.profilePic} className="w-full h-full object-cover rounded-full" alt="" />
                                        : friend.userName[0].toUpperCase()
                                    }
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-[13px] font-bold truncate ${activeChat?._id === friend._id ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {friend.userName}
                                </h3>
                                <p className="text-[12px] text-gray-400 truncate">{friend.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeChat && (
                <div className="flex-1 flex flex-col bg-white animate-in slide-in-from-right duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                {activeChat.profilePic
                                    ? <img src={activeChat.profilePic} className="w-full h-full object-cover rounded-full" alt="" />
                                    : activeChat.userName[0].toUpperCase()
                                }
                            </div>
                            <div>
                                <span className="font-bold text-sm text-gray-800 block">{activeChat.userName}</span>
                                <span className="text-[11px] text-emerald-500">Online</span>
                            </div>
                        </div>
                        <button onClick={() => setActiveChat(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 p-4 bg-gray-50/50 overflow-y-auto space-y-3">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                                    {activeChat.userName[0].toUpperCase()}
                                </div>
                                <p className="text-sm">Start a conversation with <span className="font-semibold text-gray-600">{activeChat.userName}</span></p>
                            </div>
                        )}
                        {messages.map((msg) => {
                            const isMine = msg.sender === user?._id || msg.sender?._id === user?._id;
                            return (
                                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMine
                                        ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100'
                                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'}`}
                                    >
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={msgInput}
                                onChange={(e) => setMsgInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 bg-transparent outline-none text-sm px-2"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!msgInput.trim() || sendingMsg}
                                className="text-blue-600 disabled:opacity-40 transition-opacity"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default ChatSidebar;