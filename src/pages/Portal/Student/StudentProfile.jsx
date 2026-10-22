
import React, { useEffect, useState } from 'react';
import PortalLayout from '../../../components/portal/PortalLayout';
import { supabase } from '../../../services/supabase';
import {
  GraduationCap,
  UserCheck,
  Pencil,
  Save,
  Camera,
  RefreshCw
} from 'lucide-react';

const PHOTO_BUCKET = 'student-profile-photos';

const initialForm = {
  date_of_birth: '',
  blood_group: '',
  father_name: '',
  mother_name: '',
  guardian_phone: '',
  address: ''
};

function DefaultAvatar() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      aria-label="Default student avatar"
      role="img"
    >
      <circle cx="50" cy="28" r="22" fill="#18B3C7" />
      <path
        d="M3 91 C7 65 28 57 50 57 C72 57 93 65 97 91 Q50 108 3 91Z"
        fill="#18B3C7"
      />
    </svg>
  );
}

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [photoUrl, setPhotoUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('Please log in again.');

      const { data: studentRow, error: studentError } =
        await supabase
          .from('students')
          .select(`
            id,
            student_id,
            user_id,
            class_id,
            roll_number,
            date_of_birth,
            blood_group,
            father_name,
            mother_name,
            guardian_phone,
            address,
            profile_photo_path,
            classes (
              grade_level,
              division,
              academic_year
            )
          `)
          .eq('user_id', userId)
          .single();

      if (studentError) throw studentError;

      const { data: profileRow, error: profileError } =
        await supabase
          .from('profiles')
          .select('full_name,email,is_active')
          .eq('id', userId)
          .single();

      if (profileError) throw profileError;

      setStudent(studentRow);
      setProfile(profileRow);

      setForm({
        date_of_birth: studentRow.date_of_birth || '',
        blood_group: studentRow.blood_group || '',
        father_name: studentRow.father_name || '',
        mother_name: studentRow.mother_name || '',
        guardian_phone: studentRow.guardian_phone || '',
        address: studentRow.address || ''
      });

      if (studentRow.profile_photo_path) {
        const { data, error: urlError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .createSignedUrl(studentRow.profile_photo_path, 3600);

        if (urlError) {
          setPhotoUrl('');
        } else {
          setPhotoUrl(data.signedUrl);
        }
      } else {
        setPhotoUrl('');
      }
    } catch (err) {
      setError(err.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateField = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveDetails = async (e) => {
    e.preventDefault();
    if (!student || saving) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { data, error: updateError } = await supabase
        .from('students')
        .update({
          date_of_birth: form.date_of_birth || null,
          blood_group: form.blood_group || null,
          father_name: form.father_name.trim() || null,
          mother_name: form.mother_name.trim() || null,
          guardian_phone: form.guardian_phone.trim() || null,
          address: form.address.trim() || null
        })
        .eq('id', student.id)
        .eq('user_id', student.user_id)
        .select('id');

      if (updateError) throw updateError;

      if (!data?.length) {
        throw new Error('Profile was not updated. Check permissions.');
      }

      setMessage('Personal details saved successfully.');
      setEditing(false);
      await loadProfile();
    } catch (err) {
      setError(err.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !student || uploading) return;

    setError('');
    setMessage('');

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please choose a JPG, PNG or WebP image.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('Profile photo must be smaller than 3 MB.');
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.type === 'image/png' ? 'png' :
        file.type === 'image/webp' ? 'webp' : 'jpg';

      const path = `${student.user_id}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('students')
        .update({ profile_photo_path: path })
        .eq('id', student.id)
        .eq('user_id', student.user_id);

      if (updateError) throw updateError;

      setMessage('Profile picture updated successfully.');
      await loadProfile();
    } catch (err) {
      setError(err.message || 'Unable to upload photo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const field = (label, name, type = 'text') => (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </span>
      <input
        type={type}
        value={form[name]}
        onChange={e => updateField(name, e.target.value)}
        disabled={!editing}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm disabled:bg-slate-50 disabled:text-slate-600"
      />
    </label>
  );

  return (
    <PortalLayout title="My Student Profile">
      <div className="max-w-5xl space-y-6">

        {error && (
          <div role="alert" className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl">
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-6 rounded-xl">
            Loading student profile...
          </div>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Student profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>

                <label
                  className="absolute bottom-0 right-0 bg-mis-navy text-white p-2 rounded-full cursor-pointer shadow"
                  title="Change profile photo"
                >
                  <Camera size={17} />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={uploadPhoto}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-mis-soft text-mis-blue text-xs font-bold mb-2">
                  {profile?.is_active
                    ? 'Active Enrolled Student'
                    : 'Student Profile'}
                </span>

                <h1 className="text-2xl font-extrabold text-mis-navy">
                  {profile?.full_name || 'Student'}
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Student ID: {student?.student_id || 'Not available'}
                </p>

                {uploading && (
                  <p className="text-xs text-mis-blue mt-2">
                    Uploading photo...
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-bold text-lg text-mis-navy flex items-center gap-2 mb-5">
                  <GraduationCap size={20} />
                  Academic Identity
                </h2>

                <div className="space-y-4 text-sm">
                  {[
                    ['Class', student?.classes?.grade_level],
                    ['Division', student?.classes?.division],
                    ['Roll Number', student?.roll_number],
                    ['Academic Year', student?.classes?.academic_year],
                    ['Email', profile?.email]
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 border-b border-slate-100 pb-2"
                    >
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-mis-navy text-right">
                        {value ?? 'Not available'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h2 className="font-bold text-lg text-mis-navy flex items-center gap-2">
                    <UserCheck size={20} />
                    Personal Details
                  </h2>

                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-mis-soft text-mis-blue text-xs font-bold"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                </div>

                <form onSubmit={saveDetails} className="space-y-4">
                  {field('Date of Birth', 'date_of_birth', 'date')}
                  {field('Blood Group', 'blood_group')}
                  {field("Father's Name", 'father_name')}
                  {field("Mother's Name", 'mother_name')}
                  {field('Guardian Phone', 'guardian_phone', 'tel')}

                  <label className="block">
                    <span className="block text-sm font-semibold text-slate-700 mb-1">
                      Residential Address
                    </span>

                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={e => updateField('address', e.target.value)}
                      disabled={!editing}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm disabled:bg-slate-50"
                    />
                  </label>

                  {editing && (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 bg-mis-navy text-white py-3 rounded-xl font-bold disabled:opacity-50"
                      >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          loadProfile();
                        }}
                        className="px-4 py-3 bg-slate-100 rounded-xl font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
