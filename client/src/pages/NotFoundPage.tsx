import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass-panel p-8 sm:p-12 text-center max-w-md w-full border border-white/20 bg-black">
        <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto mb-6 shadow-xl shadow-white/10">
          <Compass className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <h2 className="text-lg font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-xs text-[#A1A1AA] mb-8 leading-relaxed">
          The publication or destination you are searching for might have been moved, deleted, or does not exist.
        </p>
        <Link to="/" className="btn-primary px-6 py-3 text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-black" /> Return to Chronicle Home
        </Link>
      </div>
    </div>
  );
};
