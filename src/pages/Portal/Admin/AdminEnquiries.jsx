
import React, { useCallback, useEffect, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { portalService } from '../../../services/portalService';
import {
  Search,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';

const statuses = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'visit_scheduled', label: 'Visit Scheduled' },
  { value: 'admitted', label: 'Admitted' },
  { value: 'closed', label: 'Closed' }
];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : '-';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [savingId, setSavingId] = useState(null);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await portalService.getAdmissionEnquiries();
      setEnquiries(data);
    } catch (err) {
      setError(err.message || 'Unable to load admission enquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    setError('');

    try {
      await portalService.updateAdmissionEnquiryStatus(id, status);

      setEnquiries(previous =>
        previous.map(item =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      setError(err.message || 'Unable to update enquiry.');
    } finally {
      setSavingId(null);
    }
  };

  const filtered = enquiries.filter(item => {
    const searchable = [
      item.guardian_name,
      item.guardian_email,
      item.child_name,
      item.class_grade,
      item.phone_number
    ]
      .join(' ')
      .toLowerCase();

    return (
      searchable.includes(search.toLowerCase()) &&
      (filter === 'all' || item.status === filter)
    );
  });

  const newCount = enquiries.filter(
    item => item.status === 'new'
  ).length;

  const contactedCount = enquiries.filter(
    item => item.status === 'contacted'
  ).length;

  return (
    <PortalLayout title="Admission Enquiries Management">
      <div className="space-y-6">
        <div className="card-surface bg-white border border-slate-200 p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-mis-navy">
                Admission Enquiries
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                View and manage enquiries submitted through the school website.
              </p>
            </div>

            <button
              type="button"
              onClick={loadEnquiries}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mis-navy text-white px-4 py-2.5 text-sm font-bold disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Enquiries',
              value: enquiries.length,
              icon: Users
            },
            {
              label: 'New Enquiries',
              value: newCount,
              icon: Mail
            },
            {
              label: 'Contacted',
              value: contactedCount,
              icon: Phone
            }
          ].map(stat => (
            <div
              key={stat.label}
              className="card-surface bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-mis-navy mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon size={26} className="text-mis-blue" />
            </div>
          ))}
        </div>

        <div className="card-surface bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search parent, child, email or phone..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-mis-blue"
              />
            </div>

            <select
              value={filter}
              onChange={event => setFilter(event.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              {statuses.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex gap-2 items-start bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            Loading enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            No admission enquiries found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => (
              <div
                key={item.id}
                className="card-surface bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-mis-navy">
                      {item.guardian_name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Parent / Guardian
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays size={15} />
                    {formatDate(item.created_at)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <span className="font-bold">Child:</span>{' '}
                    {item.child_name}
                  </p>
                  <p>
                    <span className="font-bold">Age:</span>{' '}
                    {item.child_age}
                  </p>
                  <p>
                    <span className="font-bold">Class Seeking:</span>{' '}
                    {item.class_grade}
                  </p>
                  <p>
                    <span className="font-bold">Phone:</span>{' '}
                    {item.phone_number}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${item.phone_number.replace(/[^+\d]/g, '')}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-mis-blue hover:underline"
                  >
                    <Phone size={15} />
                    Call Parent
                  </a>

                  <a
                    href={`mailto:${item.guardian_email}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-mis-blue hover:underline"
                  >
                    <Mail size={15} />
                    {item.guardian_email}
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                    Parent's Message
                  </p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">
                    {item.message}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t border-slate-100 pt-4">
                  <label
                    htmlFor={`status-${item.id}`}
                    className="text-sm font-bold text-mis-navy"
                  >
                    Admission Status
                  </label>

                  <select
                    id={`status-${item.id}`}
                    value={item.status}
                    disabled={savingId === item.id}
                    onChange={event =>
                      updateStatus(item.id, event.target.value)
                    }
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white disabled:opacity-60"
                  >
                    {!statuses.some(s => s.value === item.status) && (
                      <option value={item.status}>
                        {item.status}
                      </option>
                    )}
                    {statuses.map(status => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>

                  {savingId === item.id && (
                    <span className="text-xs text-slate-500">
                      Saving...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default AdminEnquiries;
