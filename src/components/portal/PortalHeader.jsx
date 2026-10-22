import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  LogOut,
  User,
  Menu,
  Sparkles,
  ChevronDown,
  X,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { portalService } from '../../services/portalService';
import ProfileAvatar from './ProfileAvatar';

const PortalHeader = ({ title = 'Dashboard', onOpenMobileNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notices, setNotices] = useState([]);
  const [noticesError, setNoticesError] = useState('');
  const [noticesLoading, setNoticesLoading] = useState(true);
  const role = user?.role || 'student';

  useEffect(() => {
    let active = true;
    setNotices([]); setNoticesError(''); setNoticesLoading(true);

    const loadNotices = async () => {
      try {
        const data = await portalService.getStudentNotices(role);
        if (active) setNotices(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (error) {
        if (active) setNoticesError('Notifications are temporarily unavailable.');
      } finally {
        if (active) setNoticesLoading(false);
      }
    };

    loadNotices();
    return () => { active = false; };
  }, [role]);

  const handleLogout = async () => {
  try {
    await logout();
    window.location.replace('/');
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Unable to sign out. Please try again.');
  }
};

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'teacher': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'principal': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'admin': return 'bg-purple-100 text-purple-900 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left: Mobile Menu Trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open portal navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              MIS Portal /
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-mis-navy capitalize tracking-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRoleBadgeColor(user?.role)}`}>
          <Sparkles size={12} className="text-mis-gold" />
          {user?.role} Portal
        </span>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition relative"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-mis-gold ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h4 className="text-xs font-bold text-mis-navy uppercase tracking-wider">Recent Announcements</h4>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {noticesLoading && <p role="status" className="text-xs">Loading notifications...</p>}
                {noticesError && <p role="alert" className="text-xs text-red-700">{noticesError}</p>}
                {!noticesLoading && !noticesError && !notices.length && <p className="text-xs text-mis-muted">No notices available.</p>}
                {notices.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span className="text-mis-blue">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-xs font-bold text-mis-navy leading-tight">{n.title}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            <ProfileAvatar
              src={user?.avatar}
            name={user?.fullName || 'School User'}
             size={32}
/>
            <span className="text-xs font-bold text-mis-navy hidden md:inline max-w-[120px] truncate">
              {user?.fullName}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50">
              <div className="border-b border-slate-100 pb-3 mb-3">
                <p className="text-sm font-bold text-mis-navy truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-mis-soft text-mis-blue text-[10px] font-bold uppercase">
                  {user?.role} Account
                </span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(`/portal/${user?.role}/profile`);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  <User size={15} className="text-mis-blue" />
                  My Account Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut size={15} />
                  Sign Out of Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
