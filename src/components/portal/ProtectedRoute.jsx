import React from 'react';
import Loader from '../common/Loader.jsx';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [], allowPasswordChange = false, children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200 text-center space-y-4">
          <div className="p-3.5 bg-red-100 text-red-600 rounded-full w-max mx-auto">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your account role <span className="font-bold text-mis-blue uppercase">({user.role})</span> does not have permission to view this page.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link
              to={`/portal/${user.role}/dashboard`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition"
            >
              <LayoutDashboard size={16} />
              Go to My Dashboard
            </Link>
            <Link
              to="/portal/login"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.mustChangePassword && !allowPasswordChange) return <Navigate to="/portal/change-password" replace />;

  return children;
};

export default ProtectedRoute;
