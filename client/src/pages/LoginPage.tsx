import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { LogIn, Sparkles, Mail, Lock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = async () => {
    setEmail('demo@chronicle.io');
    setPassword('password123');
    try {
      setSubmitting(true);
      setError(null);
      await login('demo@chronicle.io', 'password123');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign in with demo account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Black & White Card */}
      <div className="glass-panel p-8 sm:p-10 border border-white/20 shadow-2xl relative overflow-hidden bg-black">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto mb-3 shadow-lg shadow-white/10">
            <LogIn className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">Sign in to publish articles and join discussions</p>
        </div>

        {/* Demo Fast Login Callout */}
        <div className="mb-6 p-3.5 rounded-xl bg-white/5 border border-white/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Instant Demo Account</p>
              <p className="text-[10px] text-[#A1A1AA]">demo@chronicle.io</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            disabled={submitting}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-black" /> 1-Click Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full glass-input pl-10 pr-3 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input pl-10 pr-3 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <span>Sign In to Chronicle</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-[#A1A1AA]">
            Don't have an author account?{' '}
            <Link to="/register" className="text-white font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
