import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

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

          <div className="h-6 w-px bg-gray-200" /> {/* Divider */}

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Get Started
            </Link>
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
            className="absolute top-full left-0 w-full bg-white border-b shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-600 hover:text-black"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              <Link
                to="/login"
                className="text-lg font-medium text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-full py-3 text-center bg-black text-white rounded-xl font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;