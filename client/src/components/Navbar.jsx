import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-xl font-semibold text-gray-800">
          MyApp
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-600">
          <Link to="/" className="hover:text-black transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-black transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-black transition">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-gray-600">
          <Link to="/" className="block hover:text-black">
            Home
          </Link>
          <Link to="/about" className="block hover:text-black">
            About
          </Link>
          <Link to="/contact" className="block hover:text-black">
            Contact
          </Link>
          <Link to="/login" className="block hover:text-black">
            Login
          </Link>
          <Link
            to="/signup"
            className="block text-center bg-black text-white py-2 rounded-lg"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;