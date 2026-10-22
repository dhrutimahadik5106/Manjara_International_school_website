import React, { useState, useEffect } from 'react';
import { portalService } from '../../services/portalService';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Tag,
  Info,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Sparkles
} from 'lucide-react';

const TYPE_BADGES = {
 PUBLIC_HOLIDAY: {label:'Public Holiday',bg:'bg-blue-100 text-blue-800 border-blue-200'},
 SCHOOL_HOLIDAY: {label:'School Holiday',bg:'bg-amber-100 text-amber-900 border-amber-200'},
 VACATION: {label:'Vacation',bg:'bg-emerald-100 text-emerald-800 border-emerald-200'},
 EXAM_BREAK: {label:'Exam Break',bg:'bg-purple-100 text-purple-800 border-purple-200'},
 SPECIAL_DAY: {label:'Special Day',bg:'bg-cyan-100 text-cyan-800 border-cyan-200'}
};
const category = h => h.category || ({national:'PUBLIC_HOLIDAY',public:'PUBLIC_HOLIDAY',festival:'PUBLIC_HOLIDAY',vacation:'VACATION',exam_break:'EXAM_BREAK',special:'SPECIAL_DAY'}[h.type]||'SCHOOL_HOLIDAY');
const databaseType = value => ({PUBLIC_HOLIDAY:'public',SCHOOL_HOLIDAY:'other',VACATION:'vacation',EXAM_BREAK:'exam_break',SPECIAL_DAY:'special'}[value]);

const SchoolCalendar = ({ isAdmin = false, currentRole = 'student' }) => {
  const [academicYear] = useState(`${new Date().getFullYear()}-${new Date().getFullYear()+1}`);
  const [view,setView]=useState('month');
  const [includeInactive,setIncludeInactive]=useState(false);
  const [saving,setSaving]=useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // Default Jan 2026
  const [holidays, setHolidays] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: 'SCHOOL_HOLIDAY',
    academicYear,
    description: '',
    applicableTo: ['student', 'teacher', 'principal', 'admin']
  });

  const loadHolidays = async () => {
    setLoading(true);
    setError('');
    try { const data = await portalService.getHolidays(null,currentDate.getFullYear(),isAdmin&&includeInactive); setHolidays(data); }
    catch { setHolidays([]); setError('Unable to load the school calendar. Please retry.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadHolidays();
  }, [currentDate.getFullYear(),includeInactive]);

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Check if a date string falls in a holiday range
  const getHolidaysForDay = (dayNum) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return holidays.filter(h => {
      if (filterType !== 'all' && category(h) !== filterType) return false;
      const start = h.start_date;
      const end = h.end_date || h.start_date;
      return dayStr >= start && dayStr <= end;
    });
  };

  const handleOpenAddModal = () => {
    setError('');
    setEditingHoliday(null);
    setFormData({
      title: '',
      startDate: `${year}-${String(month + 1).padStart(2, '0')}-15`,
      endDate: `${year}-${String(month + 1).padStart(2, '0')}-15`,
      type: 'SCHOOL_HOLIDAY',
      academicYear: academicYear,
      description: '',
      applicableTo: ['student', 'teacher', 'principal', 'admin']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (h) => {
    setError('');
    setEditingHoliday(h);
    setFormData({
      title: h.title,
      startDate: h.start_date,
      endDate: h.end_date || h.start_date,
      type: category(h),
      academicYear: h.academic_year || academicYear,
      description: h.description || '',
      applicableTo: h.applicable_to || ['student', 'teacher', 'principal', 'admin']
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (saving || !formData.title || !formData.startDate) return;
    if(formData.endDate&&formData.endDate<formData.startDate){setError('End date must be on or after the start date.');return;}
    setSaving(true);setError('');
    try {

    if (editingHoliday) {
      await portalService.updateHoliday(editingHoliday.id, {
        title: formData.title,
        start_date: formData.startDate,
        end_date: formData.endDate || formData.startDate,
        type: databaseType(formData.type),
        category: formData.type,
        academic_year: formData.academicYear,
        description: formData.description,
        applicable_to: formData.applicableTo
      });
    } else {
      await portalService.addHoliday({...formData,type:databaseType(formData.type),category:formData.type});
    }

    setIsModalOpen(false);
    await loadHolidays();
    } catch { setError('Unable to save the holiday. Please verify your permissions and retry.'); } finally {setSaving(false);}
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this school-created holiday? It will remain stored for future reference.')) {
      try {
      await portalService.updateHoliday(id,{is_active:false});
      if (selectedHoliday?.id === id) setSelectedHoliday(null);
      await loadHolidays();
      } catch { setError('Unable to deactivate the holiday. Please retry.'); }
    }
  };

  const visibleHolidays=holidays.filter(h=>filterType==='all'||category(h)===filterType);

  return (
    <div className="space-y-6">{error&&<p role="alert" className="text-sm text-red-700">{error}<button onClick={loadHolidays} className="ml-2 underline">Retry</button></p>}{loading&&<p role="status">Loading calendar...</p>}
      {/* Header Controls */}
      <div className="card-surface p-6 bg-white border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-mis-blue font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarIcon size={16} />
            Academic Holiday & Event Calendar
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-mis-navy">
            School Calendar ({year})
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold">Calendar Year<input aria-label="Calendar Year" type="number" min="1900" max="2200" value={year} onChange={e=>{const y=Number(e.target.value);if(y>=1900&&y<=2200){setSelectedHoliday(null);setCurrentDate(new Date(y,month,1));}}} className="w-24 bg-white border border-slate-200 rounded-xl p-2 ml-2" /></label>
          <button className="text-xs font-bold p-2 rounded-xl bg-slate-100" onClick={()=>setView(view==='month'?'year':'month')}>{view==='month'?'View year':'View month'}</button>
          {isAdmin&&<label className="text-xs"><input type="checkbox" checked={includeInactive} onChange={e=>setIncludeInactive(e.target.checked)} /> Show inactive</label>}
          {/* Filter Type */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <Filter size={14} className="ml-2 text-slate-500" />
            <select
              aria-label="Holiday category filter" value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-700 py-1.5 px-2 outline-none font-bold cursor-pointer"
            >
              <option value="all">All Types</option>
              {Object.entries(TYPE_BADGES).map(([value,badge])=><option key={value} value={value}>{badge.label}</option>)}
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition shadow"
            >
              <Plus size={16} />
              Add Holiday
            </button>
          )}
        </div>
      </div>

      {/* Main Grid + Sidebar Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Box */}
        <div className="lg:col-span-2 card-surface p-6 bg-white border border-slate-200/80">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-lg font-bold text-mis-navy w-40 text-center">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-bold text-mis-blue bg-mis-soft rounded-xl hover:bg-mis-blue/10 transition"
            >
              Today
            </button>
          </div>

          {view==='year'?<div className="space-y-3">{visibleHolidays.length?visibleHolidays.map(h=><button key={h.id} onClick={()=>setSelectedHoliday(h)} className="block text-left w-full border-b border-slate-100 py-3"><span className="text-xs text-slate-500">{h.start_date}{h.end_date&&h.end_date!==h.start_date?` to ${h.end_date}`:''}</span><p className="font-bold text-sm">{h.title}</p><span className="text-xs">{TYPE_BADGES[category(h)].label}{!h.is_active?' (inactive)':''}</span></button>):<p className="text-sm">No holidays in this year.</p>}</div>:<>
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
            <span className="text-red-500">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16 sm:h-20 bg-slate-50/50 rounded-xl" />
            ))}

            {/* Month Day Slots */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayHolidays = getHolidaysForDay(dayNum);
              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between transition relative overflow-hidden ${
                    isToday
                      ? 'border-mis-gold bg-amber-50/40 ring-1 ring-mis-gold'
                      : dayHolidays.length > 0
                      ? 'border-mis-blue/30 bg-mis-soft/30 hover:bg-mis-soft/60 cursor-pointer'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    if (dayHolidays.length > 0) setSelectedHoliday(dayHolidays[0]);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                      isToday ? 'bg-mis-gold text-mis-navy' : 'text-slate-700'
                    }`}>
                      {dayNum}
                    </span>
                    {dayHolidays.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-mis-blue" />
                    )}
                  </div>

                  {/* Holiday Title Pills */}
                  <div className="space-y-1 overflow-hidden">
                    {dayHolidays.map((h) => {
                      const badge = TYPE_BADGES[category(h)] || TYPE_BADGES.PUBLIC_HOLIDAY;
                      return (
                        <div
                          key={h.id}
                          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded truncate border ${badge.bg}`}
                          title={h.title} onClick={e=>{e.stopPropagation();setSelectedHoliday(h);}}
                        >
                          {h.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          </>}
        </div>

        {/* Sidebar: Holiday Details & Annual List */}
        <div className="space-y-6">
          {/* Selected Holiday Detail Card */}
          {selectedHoliday ? (
            <div className="card-surface p-6 bg-white border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TYPE_BADGES[category(selectedHoliday)]?.bg || TYPE_BADGES.PUBLIC_HOLIDAY.bg}`}>
                  {TYPE_BADGES[category(selectedHoliday)]?.label || 'Holiday'}
                </span>
                {isAdmin && selectedHoliday.source_kind !== 'GOVERNMENT_REFERENCE' && (
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Edit school holiday" onClick={() => handleOpenEditModal(selectedHoliday)}
                      className="p-1.5 text-slate-400 hover:text-mis-blue transition rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      aria-label="Deactivate school holiday" onClick={() => handleDelete(selectedHoliday.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-mis-navy">{selectedHoliday.title}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock size={14} className="text-mis-blue" />
                  {selectedHoliday.start_date} {selectedHoliday.end_date && selectedHoliday.end_date !== selectedHoliday.start_date ? `to ${selectedHoliday.end_date}` : ''}
                </p>
              </div>

              {selectedHoliday.source_kind==='GOVERNMENT_REFERENCE'&&<p className="text-xs text-mis-muted">Government public holiday reference. School closure is subject to the school circular.{selectedHoliday.source_url&&<a href={selectedHoliday.source_url} target="_blank" rel="noreferrer" className="block underline text-mis-blue">Official notification</a>}</p>}
              {!selectedHoliday.is_active&&<p className="text-xs">Inactive school holiday</p>}
              {selectedHoliday.description && (
                <p className="text-xs text-mis-muted leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedHoliday.description}
                </p>
              )}

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Applicable Academic Year: <strong className="text-mis-navy">{selectedHoliday.academic_year || academicYear}</strong>
              </div>
            </div>
          ) : (
            <div className="card-surface p-6 bg-mis-soft/50 border border-mis-blue/20 text-center text-xs text-mis-muted">
              <Info size={24} className="mx-auto text-mis-blue mb-2" />
              Click any highlighted calendar date to view full holiday details & circular notices.
            </div>
          )}

          {/* List of All Academic Year Holidays */}
          <div className="card-surface p-6 bg-white border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold text-mis-navy uppercase tracking-wider border-b border-slate-100 pb-2">
              Holidays in {year} ({visibleHolidays.length})
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {visibleHolidays.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No holidays added yet for {year}.</p>
              ) : (
                visibleHolidays.map((h) => {
                  const badge = TYPE_BADGES[category(h)] || TYPE_BADGES.PUBLIC_HOLIDAY;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHoliday(h)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-mis-blue/40 bg-slate-50/50 hover:bg-white transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-mis-navy">{h.title}</div>
                        <div className="text-[11px] text-slate-500 font-semibold">{h.start_date}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-mis-navy mb-1">
              {editingHoliday ? 'Edit School Holiday' : 'Add New School Holiday'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Manage authoritative holiday dates for Academic Year {formData.academicYear}.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Holiday Title / Occasion</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chhatrapati Shivaji Maharaj Jayanti"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-mis-blue outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-mis-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date (Multi-day)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-mis-blue outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Holiday Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:border-mis-blue outline-none"
                  >
                    {Object.entries(TYPE_BADGES).map(([value,badge])=><option key={value} value={value}>{badge.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                  <input required value={formData.academicYear} onChange={e=>setFormData({...formData,academicYear:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Circular Details</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide circular context or ceremony schedule..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-mis-blue outline-none"
                />
              </div>

              <button
                type="submit" disabled={saving}
                className="w-full py-2.5 bg-mis-navy hover:bg-mis-blue text-white text-xs font-bold rounded-xl transition shadow"
              >
                {editingHoliday ? 'Save Changes' : 'Confirm & Publish Holiday'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolCalendar;
