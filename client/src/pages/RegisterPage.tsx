import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, FileText } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarPreview = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    name || 'ChronicleNewUser'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        bio: bio.trim() || undefined,
        avatar: avatarPreview,
      });

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. An account with this email may already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      {/* Black & White Card */}
      <div className="glass-panel p-8 sm:p-10 border border-white/20 shadow-2xl relative overflow-hidden bg-black">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto mb-3 shadow-lg shadow-white/10">
            <UserPlus className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">Join the Chronicle community as an author and reader</p>
        </div>

        {/* Dynamic Avatar preview */}
        <div className="flex items-center justify-center gap-3 mb-6 p-3 rounded-xl bg-white/5 border border-white/15">
          <img
            src={avatarPreview}
            alt="Generated Avatar"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30 grayscale"
          />
          <div className="text-left">
            <p className="text-xs font-semibold text-white">Author Identity Avatar</p>
            <p className="text-[10px] text-[#A1A1AA]">Generated automatically from your name</p>
          </div>
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full glass-input pl-10 pr-3 py-2.5 text-sm"
                required
              />
            </div>
          </div>

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
                placeholder="alex@domain.com"
                className="w-full glass-input pl-10 pr-3 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="6+ chars"
                  className="w-full glass-input pl-10 pr-3 py-2.5 text-sm"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                Confirm
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  className="w-full glass-input pl-10 pr-3 py-2.5 text-sm"
                  minLength={6}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
              Short Bio (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-[#A1A1AA]" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Software engineer and technical writer passionate about cloud systems..."
                rows={2}
                className="w-full glass-input pl-10 pr-3 py-2 text-xs resize-none"
                maxLength={200}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Registering Account...
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-[#A1A1AA]">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
