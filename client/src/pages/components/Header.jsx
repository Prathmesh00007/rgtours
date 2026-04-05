import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-travel-primary via-travel-secondary to-travel-primary shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white rounded-full p-2 shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-travel-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0M15 11v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1m6 0V9a3 3 0 00-3-3H6a3 3 0 00-3 3v2.055"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">RG Tours</h1>
              <p className="text-xs text-black/80">Explore the World</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 text-black font-semibold list-none">
            <li>
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-all duration-300 hover:bg-black/20 ${
                  isActive("/") ? "bg-white/30 shadow-md" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className={`px-4 py-2 rounded-lg transition-all duration-300 hover:bg-black/20 ${
                  isActive("/search") ? "bg-white/30 shadow-md" : ""
                }`}
              >
                Packages
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg transition-all duration-300 hover:bg-black/20 ${
                  isActive("/about") ? "bg-white/30 shadow-md" : ""
                }`}
              >
                About
              </Link>
            </li>
            <li>
              {currentUser ? (
                <Link
                  to={`/profile/${
                    currentUser.user_role === 1 ? "admin" : "user"
                  }`}
                  className="flex items-center gap-2 hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src={currentUser.avatar || defaultProfileImg}
                    alt={currentUser.username}
                    className="w-10 h-10 border-2 border-white rounded-full shadow-md object-cover"
                  />
                  <span className="hidden lg:block">{currentUser.username}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-white text-travel-primary rounded-lg font-semibold hover:bg-travel-light transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <ul className="flex flex-col gap-3 text-white font-semibold mt-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive("/") ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive("/search") ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive("/about") ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                {currentUser ? (
                  <Link
                    to={`/profile/${
                      currentUser.user_role === 1 ? "admin" : "user"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20"
                  >
                    <img
                      src={currentUser.avatar || defaultProfileImg}
                      alt={currentUser.username}
                      className="w-10 h-10 border-2 border-white rounded-full object-cover"
                    />
                    <span>{currentUser.username}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-2 bg-white text-travel-primary rounded-lg font-semibold text-center"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
