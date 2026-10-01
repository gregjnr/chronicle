import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  PenSquare,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Compass,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                CHRONICLE<span className="text-white">.</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#A1A1AA] uppercase font-semibold -mt-1">
                Monochrome Blog
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive('/')
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className={`w-4 h-4 ${isActive('/') ? 'text-black' : 'text-white'}`} />
              Explore Feed
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/create"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive('/create')
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PenSquare className={`w-4 h-4 ${isActive('/create') ? 'text-black' : 'text-white'}`} />
                  Write Article
                </Link>

                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isActive('/dashboard') ? 'text-black' : 'text-white'}`} />
                  My Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Right Action buttons / User profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-200 focus:outline-none"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30 grayscale"
                  />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white leading-tight max-w-[110px] truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-[#A1A1AA] leading-tight">Author</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-panel p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-white/20">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-[#A1A1AA]">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/create"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <PenSquare className="w-4 h-4 text-white" />
                      Write New Story
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      Author Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/15 rounded-lg transition-colors text-left mt-1 border-t border-white/10 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white hover:text-neutral-300 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel mx-4 my-2 p-4 shadow-2xl border border-white/20">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-white" />
              Explore Feed
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <PenSquare className="w-4 h-4 text-white" />
                  Write Article
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-white" />
                  Author Dashboard
                </Link>
                <div className="border-t border-white/10 my-2 pt-2">
                  <div className="px-4 py-2 text-xs text-[#A1A1AA]">
                    Signed in as <span className="text-white font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-center rounded-xl text-sm font-medium bg-white/5 border border-white/15 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary px-4 py-2.5 text-center text-sm font-semibold"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
