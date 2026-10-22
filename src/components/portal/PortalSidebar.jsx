import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageAssets } from '../../data/images';
import ProfileAvatar from './ProfileAvatar';
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Clock,
  BookOpen,
  Award,
  Bell,
  FileText,
  DollarSign,
  Users,
  GraduationCap,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  LogOut,
  X,
  Building2,
  FolderOpen,
  ClipboardList
} from 'lucide-react';

const roleMenus = {
  
student: [
  { label: 'Dashboard', to: '/portal/student/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', to: '/portal/student/profile', icon: UserCheck },
  { label: 'Attendance', to: '/portal/student/attendance', icon: CalendarCheck },
  { label: 'Timetable', to: '/portal/student/timetable', icon: Clock },
  { label: 'Assignments', to: '/portal/student/assignments', icon: BookOpen },
  { label: 'Results', to: '/portal/student/results', icon: Award },
  { label: 'Study Material', to: '/portal/student/materials', icon: FolderOpen },
  { label: 'School Calendar', to: '/portal/student/calendar', icon: CalendarCheck },
  { label: 'Notices & Events', to: '/portal/student/notices', icon: Bell },
  { label: 'Events', to: '/portal/student/events', icon: CalendarCheck },
  { label: 'Messages', to: '/portal/student/messages', icon: Bell },
],

  
teacher: [
  { label: 'Dashboard', to: '/portal/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', to: '/portal/teacher/profile', icon: UserCheck },
  { label: 'My Classes', to: '/portal/teacher/classes', icon: GraduationCap },
  { label: 'Students', to: '/portal/teacher/students', icon: Users },
  { label: 'Mark Attendance', to: '/portal/teacher/attendance', icon: CalendarCheck },
  { label: 'My Staff Attendance', to: '/portal/teacher/my-attendance', icon: Clock },
  { label: 'Timetable', to: '/portal/teacher/timetable', icon: Clock },
  { label: 'Assignments', to: '/portal/teacher/assignments', icon: BookOpen },
  { label: 'Study Material', to: '/portal/teacher/materials', icon: FolderOpen },
  { label: 'School Calendar', to: '/portal/teacher/calendar', icon: CalendarCheck },
  {
  label: 'Student Results',
  to: '/portal/teacher/results',
  icon: FileText
},
  { label: 'Notices', to: '/portal/teacher/notices', icon: Bell },
  { label: 'Events', to: '/portal/teacher/events', icon: CalendarCheck },
  { label: 'Messages', to: '/portal/teacher/messages', icon: Bell },
],

  
principal: [
  { label: 'Dashboard', to: '/portal/principal/dashboard', icon: LayoutDashboard },
  { label: 'School Directory', to: '/portal/principal/directory', icon: Users },
  { label: 'Attendance Management', to: '/portal/principal/attendance', icon: CalendarCheck },
  { label: 'Academic Overview', to: '/portal/principal/academics', icon: Award },
  { label: 'School Calendar', to: '/portal/principal/calendar', icon: CalendarCheck },
  { label: 'Notices & Events', to: '/portal/principal/notices', icon: Bell },
  { label: 'Events', to: '/portal/principal/events', icon: CalendarCheck },
  { label: 'School Reports', to: '/portal/principal/reports', icon: FileSpreadsheet },
  { label: 'My Profile', to: '/portal/principal/profile', icon: UserCheck },
],

  admin: [
  { label: 'Dashboard', to: '/portal/admin/dashboard', icon: LayoutDashboard },
  { label: 'Admission Enquiries', to: '/portal/admin/enquiries', icon: ClipboardList },
  { label: 'Student Management', to: '/portal/admin/students', icon: Users },
    { label: 'Teacher Management', to: '/portal/admin/teachers', icon: GraduationCap },
    { label: 'Classes & Subjects', to: '/portal/admin/classes', icon: Layers },
    { label: 'School Calendar', to: '/portal/admin/calendar', icon: CalendarCheck },
    { label: 'Timetable Management', to: '/portal/admin/timetable', icon: Clock },
    { label: 'Fee Ledger', to: '/portal/admin/fees', icon: DollarSign },
    { label: 'Notices', to: '/portal/admin/notices', icon: Bell },
    { label: 'Events', to: '/portal/admin/events', icon: CalendarCheck },
    { label: 'Audit Logs', to: '/portal/admin/audit', icon: ShieldCheck },
  ]
};

const PortalSidebar = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentRole = user?.role || 'student';
  const menuItems = roleMenus[currentRole] || roleMenus.student;

  const handleLogout = async () => {
  try {
    await logout();
    window.location.replace('/');
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Unable to sign out. Please try again.');
  }
};

  return (
    <aside className="flex flex-col h-full bg-mis-navy text-white w-64 shadow-xl border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={imageAssets.logo}
            alt="MIS Logo"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-mis-gold/50"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-wide">MIS PORTAL</span>
            <span className="text-[10px] font-semibold text-mis-gold uppercase tracking-wider">
              {currentRole} Access
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Navigation
        </div>

        {menuItems.map((item) => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-mis-blue text-white font-bold shadow-md ring-1 ring-white/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <IconComp size={18} className="shrink-0 text-mis-gold" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-3">
          <ProfileAvatar
  src={user?.avatar}
  name={user?.fullName || 'School User'}
  size={36}
/>
          
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-white truncate">{user?.fullName}</span>
            <span className="text-[10px] text-slate-400 truncate">
              {user?.studentId || user?.employeeId || user?.email}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold transition-all border border-red-500/30"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default PortalSidebar;
