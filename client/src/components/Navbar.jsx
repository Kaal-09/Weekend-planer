import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "../context/useAuth";
import { axiosInstance } from '../utils/axiosInstance';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { userEmail } = useAuthStore();
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

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    const handleLogout = () => {
        // logout(); 
        setUser(null);
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
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        MyApp
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <div className="flex space-x-6 text-sm font-medium text-gray-500">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="hover:text-black transition-colors duration-200 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-gray-200" />

                    <div className="flex items-center">
                        {user ? (
                            /* AUTHENTICATED STATE: User Dropdown */
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 p-1 pr-3 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                >
                                    <div className="h-8 w-8 rounded-full bg-linear-to-tr from-gray-700 to-black flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {user.name?.charAt(0).toUpperCase() || <UserIcon size={16}/>}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{user.name?.split(' ')[0]}</span>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50"
                                        >
                                            <Link to="/profile" className="flex items-center space-x-2 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition">
                                                <UserIcon size={16} />
                                                <span>My Profile</span>
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-2 p-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
                                            >
                                                <LogOut size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* GUEST STATE: Login/Signup */
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-md active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full bg-white border-b shadow-xl md:hidden px-6 py-8"
                    >
                        <div className="flex flex-col space-y-4">
                            {user && (
                                <div className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 rounded-2xl">
                                     <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white">
                                        <UserIcon size={20} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold">{user.name}</p>
                                        <p className="text-xs text-gray-500">{userEmail}</p>
                                     </div>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600">
                                    {link.name}
                                </Link>
                            ))}
                            
                            <hr className="border-gray-100" />

                            {!user ? (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600">Login</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 text-center bg-black text-white rounded-xl font-semibold">Sign Up</Link>
                                </>
                            ) : (
                                <button onClick={handleLogout} className="w-full py-3 text-center bg-red-50 text-red-500 rounded-xl font-semibold">Sign Out</button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;