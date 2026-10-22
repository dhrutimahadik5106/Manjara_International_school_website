import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Award,
  ShieldCheck,
  LogIn,
  ArrowRight,
  ExternalLink,
  Building2,
  Lock,
  HelpCircle,
  X,
  AlertCircle
} from 'lucide-react';
const SUPPORT_PHONE = '+91 9175518919';
const SUPPORT_EMAIL = 'manjaraschool@gmail.com';
const SUPPORT_WHATSAPP_URL = `https://wa.me/919175518919?text=${encodeURIComponent('Hello Manjara International School, I need help accessing the MIS School Portal. Please assist me with my login credentials.')}`;
const SCHOOL_UDISE = '27280101009';

const portalRoles = [
  {
    id: 'student',
    title: 'Student Portal',
    badge: 'Student Access',
    icon: GraduationCap,
    color: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-50 text-blue-600',
    description:
      'Access academic timetables, exam results, assignments, library catalog, and online learning resources.',
    features: [
      'Report Cards & Marks',
      'Class Schedules',
      'Digital Homework',
      'Attendance Overview'
    ]
  },
  {
    id: 'teacher',
    title: 'Teacher & Staff Portal',
    badge: 'Staff Access',
    icon: BookOpen,
    color: 'from-amber-600 to-orange-700',
    iconBg: 'bg-amber-50 text-amber-700',
    description:
      'Manage marks entry, lesson planning, student attendance tracking, and administrative requests.',
    features: [
      'Gradebook Entry',
      'Attendance Register',
      'Lesson Plans',
      'Leave Requests'
    ]
  },
  {
    id: 'principal',
    title: 'Principal & Leadership',
    badge: 'Leadership Portal',
    icon: Award,
    color: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-emerald-50 text-emerald-700',
    description:
      'Academic oversight, departmental reports, faculty reviews, and institutional analytics dashboard.',
    features: [
      'Academic Performance',
      'Staff Management',
      'School Compliance',
      'Analytics Dashboard'
    ]
  },
  {
    id: 'admin',
    title: 'Administrative Portal',
    badge: 'System Admin',
    icon: ShieldCheck,
    color: 'from-slate-700 to-slate-900',
    iconBg: 'bg-slate-100 text-slate-800',
    description:
      'Admissions management, fee collection tracking, user credentials, and security management.',
    features: [
      'User Roles & Access',
      'Admissions Database',
      'Fee Receipts',
      'System Audit Logs'
    ]
  }
];

const PortalPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleModalLoginSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(identifier, password);

    setIsSubmitting(false);

    if (res.success && res.user) {
      setSelectedRole(null);

      navigate(
        res.user.mustChangePassword
          ? '/portal/change-password'
          : `/portal/${res.user.role}/dashboard`,
        { replace: true }
      );
    } else {
      setErrorMsg(res.error || 'Invalid username or password.');
    }
  };

  const handleCloseModal = () => {
    setSelectedRole(null);
    setIdentifier('');
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 lg:py-16">
      <div className="section-shell">

        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-mis-soft text-mis-blue-dark border border-mis-blue/20 mb-4">
            <Building2 size={14} className="text-mis-gold" />
            MIS Unified Digital Campus
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-mis-navy tracking-tight leading-tight">
            School Management Portal
          </h1>

          <p className="mt-4 text-base sm:text-lg text-mis-muted leading-relaxed">
            Welcome to the official digital portal of Manjara International
            School. Select your portal section below to sign in.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">

          {portalRoles.map((role) => {
            const IconComp = role.icon;

            return (
              <motion.div
                key={role.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card-surface flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-slate-100 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`p-3.5 rounded-xl ${role.iconBg} shadow-sm`}
                    >
                      <IconComp size={24} />
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {role.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-mis-navy mb-2 group-hover:text-mis-blue transition-colors">
                    {role.title}
                  </h2>

                  <p className="text-sm text-mis-muted mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    {role.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-xs font-medium text-slate-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-mis-gold mr-2" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setIdentifier('');
                    setPassword('');
                    setErrorMsg('');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mis-navy hover:bg-mis-blue text-white text-sm font-semibold transition-colors shadow-sm group-hover:shadow"
                >
                  <LogIn size={16} />
                  Sign In to {role.title.split(' ')[0]}
                </button>
              </motion.div>
            );
          })}

          {/* Quick Help Card */}
          <div className="card-surface p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-mis-navy to-mis-blue-dark text-white">
            <div>
              <div className="p-3.5 rounded-xl bg-white/10 text-mis-gold w-max mb-5 backdrop-blur-sm">
                <HelpCircle size={24} />
              </div>

              <h2 className="text-xl font-bold mb-2 !text-white">
                Need Credentials?
              </h2>

              <p className="text-sm text-slate-200 mb-6 leading-relaxed">
                Login credentials are assigned by the MIS IT Administration
                office during admission or onboarding.
              </p>

              <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4 mb-6">
                <div>
                  • Helpline:{' '}
                  <a href="tel:+919175518919" className="font-semibold text-white hover:underline">
                    {SUPPORT_PHONE}
                  </a>
                </div>

                <div>
                  • Email Support:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-white hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </div>

                <div>
                  • UDISE Code:{' '}
                  <span className="font-semibold text-white">
                    {SCHOOL_UDISE}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mis-gold hover:bg-amber-400 text-mis-navy text-sm font-bold transition-colors"
            >
              Contact IT Support
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="rounded-2xl border border-mis-gold/30 bg-mis-gold-soft/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-mis-gold/20 text-mis-navy shrink-0 mt-1">
              <Lock size={22} />
            </div>

            <div>
              <h3 className="text-base font-bold text-mis-navy">
                Secure Portal Access Notice
              </h3>

              <p className="text-xs sm:text-sm text-mis-muted mt-1 leading-relaxed">
                Authorized school access only. Please remember to log out
                after completing your portal session.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200"
            >

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close login"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`p-3 rounded-xl ${selectedRole.iconBg}`}
                >
                  {React.createElement(selectedRole.icon, {
                    size: 22
                  })}
                </div>

                <div>
                  <span className="text-xs font-semibold text-mis-gold uppercase tracking-wider">
                    Portal Login
                  </span>

                  <h3 className="text-lg font-bold text-mis-navy">
                    {selectedRole.title}
                  </h3>
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 leading-relaxed flex items-start gap-2">
                  <AlertCircle
                    size={16}
                    className="shrink-0 text-red-600 mt-0.5"
                  />

                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={handleModalLoginSubmit}
                className="space-y-4"
              >

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username / Email Address
                  </label>

                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or username"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-mis-blue focus:ring-2 focus:ring-mis-blue/20 outline-none transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Password
                  </label>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-mis-blue focus:ring-2 focus:ring-mis-blue/20 outline-none transition"
                  />
                </div>

                {/* Sign In */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-mis-navy hover:bg-mis-blue text-white text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </span>

                  <ArrowRight size={16} />
                </button>

                <p className="text-xs text-slate-500 mt-3">
                  Students and teachers: use the username provided by school.
                  Forgot your password? Contact the school administrator for a
                  new temporary password.
                </p>
              </form>

              {/* Support */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Having trouble? Contact MIS Support at{' '}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-mis-blue font-semibold"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortalPage;