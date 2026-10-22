
import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  UserRound,
  GraduationCap,
  X,
} from 'lucide-react';

export default function AccountCredentials({ account, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  if (!account) return null;

  const isReset = account.action === 'reset';

  const copy = async (value, label = 'Copied') => {
    if (!value) {
      setMessage('No value available to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(String(value));
      setMessage(`${label} copied successfully.`);
    } catch {
      setMessage('Copy failed. Please copy the text manually.');
    }
  };

  const studentId = account.studentId || account.student_id || '';

  const allCredentials = [
    'MANJARA INTERNATIONAL SCHOOL',
    isReset ? 'PASSWORD RESET' : 'NEW ACCOUNT',
    '',
    `Name: ${account.fullName || 'Not provided'}`,
    `Role: ${account.role || 'Not provided'}`,
    ...(studentId ? [`Student ID: ${studentId}`] : []),
    `Username: ${account.username || ''}`,
    `Temporary Password: ${account.temporaryPassword || ''}`,
    '',
    'Please change your temporary password after your first login.',
  ].join('\n');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Account credentials"
      className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">

        <div className="flex justify-between items-start gap-3">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2
                size={26}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-mis-navy">
                {isReset
                  ? 'Password Reset Successful'
                  : 'Account Created Successfully'}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Manjara International School
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close credentials"
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">

          <div className="flex items-center gap-2">
            <UserRound size={17} className="text-mis-blue" />
            <div>
              <p className="text-xs text-slate-500">Account Holder</p>
              <p className="font-bold text-mis-navy">
                {account.fullName || 'School User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap size={17} className="text-mis-blue" />
            <div>
              <p className="text-xs text-slate-500">Account Role</p>
              <p className="font-semibold text-slate-700 capitalize">
                {account.role || 'School Account'}
              </p>
            </div>
          </div>
        </div>

        {studentId && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              Student ID
            </label>

            <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="font-mono text-sm font-bold text-mis-navy break-all">
                {studentId}
              </span>

              <button
                type="button"
                onClick={() => copy(studentId, 'Student ID')}
                className="text-mis-blue shrink-0"
                aria-label="Copy Student ID"
              >
                <Copy size={17} />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600">
            Login Username
          </label>

          <div className="flex items-center justify-between gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
            <span className="font-mono text-sm font-bold text-mis-navy break-all">
              {account.username || 'Not available'}
            </span>

            <button
              type="button"
              onClick={() => copy(account.username, 'Username')}
              className="text-mis-blue shrink-0"
              aria-label="Copy username"
            >
              <Copy size={17} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
            <KeyRound size={15} />
            Temporary Password
          </label>

          <div className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <span className="font-mono text-sm font-bold text-slate-900 break-all">
              {showPassword
                ? account.temporaryPassword || 'Not available'
                : '••••••••••••'}
            </span>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-600 hover:text-mis-blue"
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>

              <button
                type="button"
                onClick={() =>
                  copy(account.temporaryPassword, 'Password')
                }
                className="text-mis-blue"
                aria-label="Copy password"
              >
                <Copy size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Important:</strong> Save these credentials securely.
            The temporary password can only be viewed now.
            If it is lost, the Admin must reset the password.
            The student should change it at the first login.
          </p>
        </div>

        {message && (
          <p
            role="status"
            className="text-xs font-semibold text-emerald-700"
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => copy(allCredentials, 'All credentials')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-mis-navy hover:bg-mis-blue text-white font-bold text-sm rounded-xl transition"
        >
          <Copy size={17} />
          Copy All Credentials
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
