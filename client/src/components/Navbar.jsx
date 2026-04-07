import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, User as UserIcon, LogOut, ChevronDown, UserCircle } from "lucide-react";
import { useAuthStore } from "../context/useAuth";
import { axiosInstance } from '../utils/axiosInstance';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { userEmail, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if(userEmail) {
                    const res = await axiosInstance.get(`/user/getuserByEmail/${userEmail}`);
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error("Error fetching user", err);
            }
        };
        fetchUser();
    }, [userEmail]);

    const handleLogout = () => {
        logout(); 
        setUser(null);
        setIsProfileOpen(false);
        navigate("/");
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-black p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Rocket size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">MyApp</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <div className="flex space-x-6 text-sm font-medium text-gray-500">
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <Link to="/about" className="hover:text-black transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-black transition-colors">Contact</Link>
                    </div>

                    <div className="h-6 w-px bg-gray-200" />

                    {/* Auth Logic */}
                    <div className="flex items-center">
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 active:scale-95"
                                >
                                    <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold shadow-md">
                                        {user.name?.charAt(0).toUpperCase() || <UserIcon size={14}/>}
                                    </div>
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {user.name?.split(' ')[0]} {/* Shows only First Name */}
                                        </span>
                                    </div>
                                    <ChevronDown 
                                        size={14} 
                                        className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} 
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <>
                                            {/* Transparent Overlay to close on click outside */}
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 origin-top-right"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-50 mb-1 flex gap-3">
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider pt-1">Account</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user.userName}</p>
                                                </div>
                                                <Link to="/profile" className="flex items-center space-x-3 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition">
                                                    <UserCircle size={18} />
                                                    <span>My Profile</span>
                                                </Link>
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-3 p-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
                                                >
                                                    <LogOut size={18} />
                                                    <span>Sign Out</span>
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black">Login</Link>
                                <Link to="/signup" className="px-5 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 shadow-md transition-all active:scale-95">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            {user && (
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl mb-2">
                                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white text-lg font-bold">
                                        {user.userName?.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-gray-900 truncate">{user.userName}</p>
                                        <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col space-y-3">
                                <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600">Home</Link>
                                <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600">About</Link>
                                <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600">Contact</Link>
                            </div>
                            <hr className="border-gray-100" />
                            {!user ? (
                                <div className="flex flex-col space-y-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 font-medium text-gray-600">Login</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-black text-white text-center py-3 rounded-xl font-bold">Sign Up</Link>
                                </div>
                            ) : (
                                <button className="z-10 w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold">Sign Out</button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;