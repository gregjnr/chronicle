import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Code2, Database, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                CHRONICLE<span className="text-white">.</span>
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA] max-w-md leading-relaxed">
              A modern full-stack publishing platform engineered with React, Node.js, Express, and
              MongoDB. Designed with an ultra-clean monochrome black and white aesthetic.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/15 text-white">
                <Code2 className="w-3.5 h-3.5 text-white" /> React 19 + Vite
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/15 text-white">
                <Cpu className="w-3.5 h-3.5 text-white" /> Express Node.js
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/15 text-white">
                <Database className="w-3.5 h-3.5 text-white" /> MongoDB + Mongoose
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/15 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-white" /> JWT Auth
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#A1A1AA]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Explore Stories
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-white transition-colors">
                  Write an Article
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Author Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Categories</h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-[#A1A1AA]">
              {['Technology', 'Design', 'Development', 'AI & ML', 'Career', 'Lifestyle'].map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-white transition-colors"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A1A1AA] gap-4">
          <p>© {new Date().getFullYear()} Chronicle Publishing Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered in Black & White Monochrome.
          </p>
        </div>
      </div>
    </footer>
  );
};
