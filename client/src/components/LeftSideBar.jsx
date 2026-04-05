import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Map, Clock, User, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "../context/useAuth";

const Sidebar = () => {
  const recentTrips = [
    "Trip to Shimla",
    "Trip to Ladakh",
    "Trip to Goa",
    "Trip to Manali",
  ];
  const temp = motion
  if(!temp);
  const { logout } = useAuthStore();
  const logoutHandler = async () => {
    logout()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-white/80 backdrop-blur-xl border-l border-gray-100 flex flex-col p-8 z-40 shadow-2xl shadow-gray-200/50">
      
      {/* 1. SECTION: MAIN NAV */}
      <div className="mb-10 pt-16"> {/* pt-16 to clear the fixed navbar */}
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 px-2">
          Discovery
        </h2>

        <nav className="space-y-1">
          <SidebarLink to="/plan" icon={<Compass size={20} />} label="Plan a Trip" active />
          <SidebarLink to="/trending" icon={<Map size={20} />} label="Explore Map" />
        </nav>
      </div>

      {/* 2. SECTION: RECENT ACTIVITY */}
      <div className="grow">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 px-2 flex items-center gap-2">
          <Clock size={12} /> Recent History
        </h2>

        <div className="space-y-1">
          {recentTrips.map((trip, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 5 }}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-100"
            >
              <span className="text-sm text-gray-600 group-hover:text-black transition-colors font-medium">
                {trip}
              </span>
              <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. SECTION: USER PROFILE & FOOTER */}
      <div className="pt-6 border-t border-gray-100 space-y-2">
        <SidebarLink to="/profile" icon={<User size={18} />} label="My Profile" />
        <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
        
        <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-4 group cursor-pointer">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform " />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

// Sub-component for clean code
const SidebarLink = ({ to, icon, label, active = false }) => (
  <Link to={to} className="block group">
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
        active 
          ? "bg-black text-white shadow-lg shadow-black/20" 
          : "text-gray-500 hover:bg-gray-50 hover:text-black"
      }`}
    >
      {icon}
      <span className="text-[14px] font-semibold">{label}</span>
    </motion.div>
  </Link>
);

export default Sidebar;