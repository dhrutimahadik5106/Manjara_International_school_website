import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageAssets } from '../../data/images';
import {
  LogIn,
  Lock,
  User,
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMessage('Please enter your username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Execute database-driven Supabase authentication
    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      // Role is retrieved exclusively from PostgreSQL user profile
      const redirectPath = (res.user.mustChangePassword ? '/portal/change-password' : `/portal/${res.user.role}/dashboard`);
      navigate(redirectPath, { replace: true });
    } else {
      // Display inline error without browser alert()
      setErrorMessage(res.error || 'Invalid username or password.');
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Graphic Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-mis-blue/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-mis-gold/20 rounded-full blur-3xl" />
        <img
          src={imageAssets.schoolHero}
          alt="MIS Campus Background"
          className="w-full h-full object-cover opacity-20 filter brightness-50"
        />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <img
              src={imageAssets.logo}
              alt="MIS Logo"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-mis-gold/40 shadow-sm"
            />
          </Link>
          <div className="inline-block px-3 py-1 rounded-full bg-mis-soft text-mis-blue text-xs font-bold uppercase tracking-wider mb-2">
            School Management System
          </div>
          <h1 className="text-2xl font-extrabold text-mis-navy tracking-tight">
            Portal Authentication
          </h1>
          <p className="text-xs text-mis-muted mt-1">
            Sign in with your school username (Admin and Principal: email) and password.
          </p>
        </div>

        {/* Inline Error Alert */}
        {(errorMessage || authError) && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 leading-relaxed flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username / Admin or Principal Email
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@manjaraschool.edu.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-mis-blue focus:ring-2 focus:ring-mis-blue/20 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-mis-blue focus:ring-2 focus:ring-mis-blue/20 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-mis-navy hover:bg-mis-blue text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            <span>{isSubmitting ? 'Signing in...' : 'Sign In to Portal'}</span>
          </button>
        <p className="text-xs text-slate-500 mt-3">Students and teachers: use the username provided by school. Forgot your password? Contact the school administrator for a new temporary password.</p></form>

        <div className="mt-5 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-mis-blue transition">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
