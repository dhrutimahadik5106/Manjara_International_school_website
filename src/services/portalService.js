
import { supabase } from './supabase';

export const PORTAL_ERROR =
  'Unable to load school records. Please retry or contact the school administrator.';

const studentFields =
  'id,user_id,student_id,class_id,roll_number,date_of_birth,blood_group,address,profiles!students_user_id_fkey(id,full_name,email,username,phone_number,avatar_url,is_active),classes(id,grade_level,division,academic_year,room_number)';

const teacherFields =
  'id,user_id,employee_id,qualification,specialization,profiles!teachers_user_id_fkey(id,full_name,email,username,phone_number,avatar_url,is_active),teacher_class_assignments(id,class_id,subject_id,classes(id,grade_level,division,academic_year),subjects(id,name))';

export async function result(query) {
  const { data, error } = await query;

  if (error) {
    console.error('Supabase portal request failed:', {
      code: error.code,
      message: error.message,
      details: error.details
    });
    throw new Error(PORTAL_ERROR);
  }

  return data;
}

const list = async (query) => (await result(query)) || [];

export const studentView = (s) => ({
  ...s,
  studentId: s.student_id,
  username: s.profiles?.username,
  fullName: s.profiles?.full_name || '',
  email: s.profiles?.email || '',
  phone: s.profiles?.phone_number || '',
  grade: s.classes?.grade_level || '',
  division: s.classes?.division || '',
  academicYear: s.classes?.academic_year || '',
  rollNumber: s.roll_number,
  dob: s.date_of_birth,
  bloodGroup: s.blood_group,
  isActive: s.profiles?.is_active
});

const teacherView = (t) => ({
  ...t,
  fullName: t.profiles?.full_name || '',
  email: t.profiles?.email || '',
  employeeId: t.employee_id,
  username: t.profiles?.username,
  phone: t.profiles?.phone_number || '',
  assignedClasses: (t.teacher_class_assignments || []).map(a => ({
    ...a,
    grade: a.classes?.grade_level,
    division: a.classes?.division,
    academicYear: a.classes?.academic_year,
    subject: a.subjects?.name
  }))
});

export const localDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function audience(roles = ['student', 'teacher', 'principal']) {
  if (
    !Array.isArray(roles) ||
    !roles.length ||
    roles.some(r => !['student', 'teacher', 'principal'].includes(r))
  ) {
    throw new Error('Select at least one school audience.');
  }

  return [...new Set(roles)];
}

async function identity() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error('Please sign in to access the portal.');
  }

  const profile = await result(
    supabase
      .from('profiles')
      .select('id,role,is_active')
      .eq('id', data.user.id)
      .single()
  );

  if (!profile || profile.is_active !== true) {
    throw new Error('This portal account is inactive.');
  }

  return profile;
}

async function requireRole(roles) {
  const profile = await identity();

  if (!roles.includes(profile.role)) {
    throw new Error('Your account cannot perform this action.');
  }

  return profile;
}

async function ownTeacher() {
  const profile = await requireRole(['teacher']);

  const teacher = await result(
    supabase
      .from('teachers')
      .select(teacherFields)
      .eq('user_id', profile.id)
      .single()
  );

  return teacherView(teacher);
}

async function studentScope(studentId) {
  const students = await portalService.getStudents();

  const student = students.find(
    s => s.id === studentId || s.studentId === studentId
  );

  if (!student) {
    throw new Error('No authorized student is selected.');
  }

  return student;
}

async function assignedClass(classId, subjectId) {
  const teacher = await ownTeacher();

  const assignment = teacher.assignedClasses.find(
    a =>
      a.class_id === classId &&
      (!subjectId || a.subject_id === subjectId)
  );

  if (!assignment) {
    throw new Error('Select one of your assigned classes and subjects.');
  }

  return { teacher, assignment };
}

export const portalService = {

  // STUDENT MANAGEMENT

  async getStudents() {
    const profile = await identity();

    let query = supabase
      .from('students')
      .select(studentFields);

    if (profile.role === 'student') {
      query = query.eq('user_id', profile.id);
    } else if (profile.role === 'teacher') {
      const teacher = await ownTeacher();

      const ids = [
        ...new Set(teacher.assignedClasses.map(a => a.class_id))
      ];

      if (!ids.length) return [];

      query = query.in('class_id', ids);
    } else if (!['admin', 'principal'].includes(profile.role)) {
      throw new Error('Your account role is not configured.');
    }

    const rows = await list(
      query.order('student_id').limit(1000)
    );

    return rows.map(studentView);
  },

  // TEACHER MANAGEMENT

  async getTeachers() {
    const profile = await requireRole([
      'teacher',
      'principal',
      'admin'
    ]);

    let query = supabase
      .from('teachers')
      .select(teacherFields);

    if (profile.role === 'teacher') {
      query = query.eq('user_id', profile.id);
    }

    const rows = await list(
      query.order('employee_id').limit(1000)
    );

    return rows.map(teacherView);
  },

  async getRoleDetails() {
    const profile = await identity();

    if (profile.role === 'student') {
      const students = await this.getStudents();
      return { students, teacher: null };
    }

    if (profile.role === 'teacher') {
      return {
        students: [],
        teacher: await ownTeacher()
      };
    }

    return { students: [], teacher: null };
  },

  // STUDENT ATTENDANCE

  async getStudentAttendance(studentId) {
    const student = await studentScope(studentId);

    return list(
      supabase
        .from('attendance')
        .select('id,date,status,remarks,class_id')
        .eq('student_id', student.id)
        .order('date', { ascending: false })
        .limit(1000)
    );
  },

  // STUDENT RESULTS

  async getStudentResults(studentId) {
    const student = await studentScope(studentId);

    const rows = await list(
      supabase
        .from('results')
        .select(
          'id,term,marks_obtained,max_marks,grade,remarks,subjects(name,code)'
        )
        .eq('student_id', student.id)
        .order('term')
        .limit(1000)
    );

    return rows.map(r => ({
      ...r,
      subject: r.subjects?.name,
      code: r.subjects?.code,
      marks: r.marks_obtained,
      maxMarks: r.max_marks,
      academicYear: student.academicYear
    }));
  },

  // STUDENT ASSIGNMENTS

  async getStudentAssignments(studentId) {
    const student = await studentScope(studentId);

    if (!student.class_id) return [];

    const [assignments, submissions] = await Promise.all([
      list(
        supabase
          .from('assignments')
          .select(
            'id,title,description,due_date,attachment_url,subjects(name),teachers(profiles!teachers_user_id_fkey(full_name))'
          )
          .eq('class_id', student.class_id)
          .order('due_date', { ascending: false })
          .limit(500)
      ),
      list(
        supabase
          .from('assignment_submissions')
          .select(
            'id,assignment_id,status,file_url,submission_date,grade,feedback'
          )
          .eq('student_id', student.id)
          .limit(1000)
      )
    ]);

    return assignments.map(a => {
      const submission = submissions.find(
        s => s.assignment_id === a.id
      );

      return {
        ...a,
        subject: a.subjects?.name,
        teacherName: a.teachers?.profiles?.full_name,
        dueDate: a.due_date,
        status:
          submission?.status ||
          (a.due_date < localDate() ? 'late' : 'pending'),
        submissionFile: submission?.file_url,
        submissionDate: submission?.submission_date,
        feedback: submission?.feedback
      };
    });
  },

  // TIMETABLE

  async getStudentTimetable(studentId) {
    const student = await studentScope(studentId);

    if (!student.class_id) return [];

    return this.getTimetableForClass(student.class_id);
  },

  async getTimetableForClass(classId) {
    return list(
      supabase
        .from('timetable')
        .select(
          'id,day_of_week,start_time,end_time,room_number,subject_id,subjects(name),teachers(profiles!teachers_user_id_fkey(full_name))'
        )
        .eq('class_id', classId)
        .order('start_time')
        .limit(100)
    );
  },

  // STUDY MATERIALS

  async getStudentMaterials(studentId) {
    const student = await studentScope(studentId);

    if (!student.class_id) return [];

    return list(
      supabase
        .from('study_materials')
        .select(
          'id,title,description,file_url,file_type,created_at,subjects(name),teachers(profiles!teachers_user_id_fkey(full_name))'
        )
        .eq('class_id', student.class_id)
        .order('created_at', { ascending: false })
        .limit(500)
    );
  },

  // STUDENT FEES

  async getFees(studentId) {
    const student = await studentScope(studentId);

    return list(
      supabase
        .from('fees')
        .select(
          'id,academic_year,total_amount,paid_amount,pending_amount,status,due_date,receipt_ref'
        )
        .eq('student_id', student.id)
        .order('academic_year', { ascending: false })
    );
  },

  // NOTICES

  async getStudentNotices() {
    const profile = await identity();

    let query = supabase
      .from('notices')
      .select(
        'id,title,content,is_important,created_at,target_roles,profiles!notices_published_by_fkey(full_name)'
      );

    if (profile.role !== 'admin') {
      query = query.contains('target_roles', [profile.role]);
    }

    const rows = await list(
      query.order('created_at', { ascending: false }).limit(100)
    );

    return rows.map(n => ({
      ...n,
      date: n.created_at?.slice(0, 10),
      author: n.profiles?.full_name || 'School',
      isImportant: n.is_important,
      targetRoles: n.target_roles
    }));
  },

  // EVENTS

  async getEvents() {
    const profile = await identity();

    let query = supabase
      .from('events')
      .select(
        'id,title,description,event_date,location,target_roles'
      );

    if (profile.role !== 'admin') {
      query = query.contains('target_roles', [profile.role]);
    }

    return list(
      query
        .gte('event_date', localDate())
        .order('event_date')
        .limit(100)
    );
  },

  // SCHOOL HOLIDAYS
  // FIXED: Only real database columns are requested.

  async getHolidays(
    academicYear = null,
    calendarYear = null,
    includeInactive = false
  ) {
    const profile = await identity();

    let query = supabase
      .from('holidays')
      .select(
        'id,title,start_date,end_date,type,academic_year,description,applicable_to,is_active'
      );

    if (profile.role !== 'admin' || !includeInactive) {
      query = query.eq('is_active', true);
    }

    if (calendarYear) {
      const year = Number(calendarYear);

      if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2200
      ) {
        throw new Error('Select a valid calendar year.');
      }

      const start = `${year}-01-01`;
      const end = `${year}-12-31`;

      query = query
        .lte('start_date', end)
        .or(
          `end_date.gte.${start},and(end_date.is.null,start_date.gte.${start})`
        );
    }

    if (profile.role !== 'admin') {
      query = query.contains('applicable_to', [profile.role]);
    }

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    const rows = await list(
      query.order('start_date').limit(500)
    );

    // These fields are created in JavaScript for the UI.
    // They are NOT requested from Supabase.

    const categoryByType = {
      national: 'PUBLIC_HOLIDAY',
      public: 'PUBLIC_HOLIDAY',
      festival: 'PUBLIC_HOLIDAY',
      vacation: 'VACATION',
      exam_break: 'EXAM_BREAK',
      special: 'SPECIAL_DAY',
      other: 'SCHOOL_HOLIDAY'
    };

    return rows.map(h => ({
      ...h,
      category:
        categoryByType[h.type] || 'SCHOOL_HOLIDAY',
      source_kind: [
        'national',
        'public',
        'festival'
      ].includes(h.type)
        ? 'GOVERNMENT_REFERENCE'
        : 'SCHOOL',
      source_url: null
    }));
  },

  // TEACHER ASSIGNMENTS

  async getTeacherAssignments() {
    const teacher = await ownTeacher();

    return list(
      supabase
        .from('assignments')
        .select(
          'id,title,description,due_date,attachment_url,class_id,subject_id,subjects(name),classes(grade_level,division),assignment_submissions(id,student_id,status,submission_date)'
        )
        .eq('teacher_id', teacher.id)
        .order('due_date', { ascending: false })
        .limit(500)
    );
  },

  async getTeacherMaterials() {
    const teacher = await ownTeacher();

    return list(
      supabase
        .from('study_materials')
        .select(
          'id,title,description,file_url,file_type,created_at,subjects(name)'
        )
        .eq('teacher_id', teacher.id)
        .order('created_at', { ascending: false })
        .limit(500)
    );
  },

  async getTeacherTimetable() {
    const teacher = await ownTeacher();

    return list(
      supabase
        .from('timetable')
        .select(
          'id,day_of_week,start_time,end_time,room_number,subjects(name),classes(grade_level,division)'
        )
        .eq('teacher_id', teacher.id)
        .order('start_time')
        .limit(100)
    );
  },

  // TEACHER ATTENDANCE MANAGEMENT

  async getAttendance(classId, date) {
    await assignedClass(classId);

    const [students, records] = await Promise.all([
      list(
        supabase
          .from('students')
          .select(
            'id,student_id,roll_number,profiles!students_user_id_fkey(full_name)'
          )
          .eq('class_id', classId)
          .order('roll_number')
      ),
      list(
        supabase
          .from('attendance')
          .select('student_id,status,remarks')
          .eq('class_id', classId)
          .eq('date', date)
      )
    ]);

    return students.map(s => ({
      id: s.id,
      studentId: s.student_id,
      studentName: s.profiles?.full_name,
      rollNumber: s.roll_number,
      status:
        records.find(r => r.student_id === s.id)?.status || '',
      remarks:
        records.find(r => r.student_id === s.id)?.remarks || ''
    }));
  },

  async saveAttendance(classId, date, attendanceList) {
  
    // Prevent attendance on Saturdays, Sundays and holidays.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Select a valid attendance date.');
    }

    const selectedDate = new Date(`${date}T12:00:00Z`);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.toISOString().slice(0, 10) !== date
    ) {
      throw new Error('Invalid attendance date.');
    }

    const day = selectedDate.getUTCDay();

    if (day === 0 || day === 6) {
      throw new Error(
        'Attendance is not allowed on Saturdays or Sundays.'
      );
    }

    const holidays = await this.getHolidays(
      null,
      Number(date.slice(0, 4))
    );

    const holiday = holidays.find((h) => {
      const start = h.start_date;
      const end = h.end_date || start;

      return (
        date >= start &&
        date <= end &&
        (
          !h.applicable_to ||
          h.applicable_to.includes('student')
        )
      );
    });

    if (holiday) {
      throw new Error(
        `Attendance is not allowed: ${holiday.title}.`
      );
    }
    
    const { teacher } = await assignedClass(classId);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !attendanceList.length ||
      attendanceList.some(
        s =>
          !['present', 'absent', 'late', 'excused'].includes(
            s.status
          )
      )
    ) {
      throw new Error(
        'Select a date and mark every student before saving.'
      );
    }

    const students = await list(
      supabase
        .from('students')
        .select('id')
        .eq('class_id', classId)
    );

    if (
      attendanceList.some(
        s => !students.some(a => a.id === s.id)
      )
    ) {
      throw new Error(
        'The attendance list contains an unauthorized student.'
      );
    }

    await result(
      supabase
        .from('attendance')
        .upsert(
          attendanceList.map(s => ({
            student_id: s.id,
            class_id: classId,
            date,
            status: s.status,
            remarks: s.remarks || null,
            marked_by: teacher.user_id
          })),
          { onConflict: 'student_id,date' }
        )
    );
  },

  // CREATE ASSIGNMENT

  async createAssignment(data) {
    const { teacher } = await assignedClass(
      data.class_id,
      data.subject_id
    );

    if (
      !data.title?.trim() ||
      !data.description?.trim() ||
      !data.due_date
    ) {
      throw new Error(
        'Enter a title, instructions, and due date.'
      );
    }

    return result(
      supabase
        .from('assignments')
        .insert({
          teacher_id: teacher.id,
          class_id: data.class_id,
          subject_id: data.subject_id,
          title: data.title.trim(),
          description: data.description.trim(),
          due_date: data.due_date,
          attachment_url: data.attachment_url || null
        })
        .select('id')
        .single()
    );
  },

  // PUBLISH STUDY MATERIAL

  async publishMaterial(data) {
    const { teacher } = await assignedClass(
      data.class_id,
      data.subject_id
    );

    if (
      !data.title?.trim() ||
      !(
        data.file_url?.startsWith('https://') ||
        data.file_url?.startsWith('storage://')
      )
    ) {
      throw new Error(
        'Enter a title and a secure file link.'
      );
    }

    return result(
      supabase
        .from('study_materials')
        .insert({
          teacher_id: teacher.id,
          class_id: data.class_id,
          subject_id: data.subject_id,
          title: data.title.trim(),
          description: data.description || '',
          file_url: data.file_url,
          file_type: data.file_type || null
        })
        .select('id')
        .single()
    );
  },

  // ASSIGNMENT SUBMISSION

  async submitAssignment(assignmentId, file) {
    const profile = await requireRole(['student']);

    const student = await result(
      supabase
        .from('students')
        .select('id,class_id')
        .eq('user_id', profile.id)
        .single()
    );

    const assignment = await result(
      supabase
        .from('assignments')
        .select('id')
        .eq('id', assignmentId)
        .eq('class_id', student.class_id)
        .single()
    );

    const fileUrl = await this.uploadFile(
      file,
      'submissions'
    );

    await result(
      supabase
        .from('assignment_submissions')
        .upsert(
          {
            student_id: student.id,
            assignment_id: assignment.id,
            file_url: fileUrl,
            status: 'submitted',
            submission_date: new Date().toISOString()
          },
          { onConflict: 'assignment_id,student_id' }
        )
    );
  },

  // FILE UPLOAD

  async uploadFile(file, purpose = 'materials') {
    const profile = await requireRole(
      purpose === 'submissions'
        ? ['student']
        : ['teacher']
    );

    const bucket =
      import.meta.env.VITE_PORTAL_STORAGE_BUCKET;

    if (!bucket) {
      throw new Error(
        'File uploads are not configured. Please contact the school administrator.'
      );
    }

    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (
      !file ||
      !allowed.includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      throw new Error(
        'Choose a PDF, DOCX, JPG, or PNG file up to 10 MB.'
      );
    }

    const path =
      `${profile.id}/${purpose}/${crypto.randomUUID()}.` +
      file.name.split('.').pop().toLowerCase();

    await result(
      supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: false,
          contentType: file.type
        })
    );

    return `storage://${bucket}/${path}`;
  },

  async getFileUrl(value) {
    if (!value) return null;

    if (value.startsWith('storage://')) {
      const [bucket, ...parts] = value
        .slice(10)
        .split('/');

      const data = await result(
        supabase.storage
          .from(bucket)
          .createSignedUrl(parts.join('/'), 60)
      );

      return data.signedUrl;
    }

    try {
      const url = new URL(value);
      return url.protocol === 'https:'
        ? url.href
        : null;
    } catch {
      return null;
    }
  },

  // SCHOOL OVERVIEW

  async getSchoolOverview() {
    await requireRole(['admin', 'principal']);

    const [
      students,
      teachers,
      attendance,
      results,
      notices,
      events
    ] = await Promise.all([
      supabase
        .from('students')
        .select('id', { count: 'exact', head: true }),

      supabase
        .from('teachers')
        .select('id', { count: 'exact', head: true }),

      this.getSchoolAttendance(),
      this.getSchoolResults(),
      this.getStudentNotices(),
      this.getEvents()
    ]);

    if (students.error || teachers.error) {
      throw new Error(PORTAL_ERROR);
    }

    return {
      students: students.count,
      teachers: teachers.count,
      attendance,
      results,
      notices,
      events
    };
  },

  async getSchoolAttendance(date = localDate()) {
    await requireRole(['admin', 'principal']);

    return list(
      supabase
        .from('attendance')
        .select(
          'id,date,status,classes(grade_level,division)'
        )
        .eq('date', date)
        .limit(1000)
    );
  },

  async getSchoolResults() {
    await requireRole(['admin', 'principal']);

    return list(
      supabase
        .from('results')
        .select(
          'id,term,marks_obtained,max_marks,subjects(name),students(classes(grade_level,division))'
        )
        .limit(1000)
    );
  },

  // AUDIT LOGS

  async getAuditLogs() {
    await requireRole(['admin']);

    const rows = await list(
      supabase
        .from('audit_logs')
        .select(
          'id,action,details,created_at,profiles!audit_logs_user_id_fkey(full_name)'
        )
        .order('created_at', { ascending: false })
        .limit(100)
    );

    return rows.map(l => ({
      ...l,
      username: l.profiles?.full_name || 'School',
      timestamp: new Date(
        l.created_at
      ).toLocaleString()
    }));
  },

  // ADD NOTICE

  async addNotice(data) {
    const profile = await requireRole([
      'admin',
      'principal'
    ]);

    return result(
      supabase
        .from('notices')
        .insert({
          title: data.title,
          content: data.content,
          published_by: profile.id,
          is_important: Boolean(data.isImportant),
          target_roles: audience(data.targetRoles)
        })
        .select('id')
        .single()
    );
  },

  async updateNotice(id, data) {
    await requireRole(['admin']);

    return result(
      supabase
        .from('notices')
        .update({
          title: data.title,
          content: data.content,
          target_roles: audience(data.targetRoles)
        })
        .eq('id', id)
        .select('id')
        .single()
    );
  },

  // ADD EVENT

  async addEvent(data) {
    await requireRole(['admin']);

    return result(
      supabase
        .from('events')
        .insert({
          title: data.title,
          description: data.description,
          event_date: data.eventDate,
          location: data.location,
          target_roles: audience(data.targetRoles)
        })
        .select('id')
        .single()
    );
  },

  // ADD SCHOOL HOLIDAY

  async addHoliday(data) {
    await requireRole(['admin']);

    const allowedTypes = [
      'national',
      'public',
      'festival',
      'vacation',
      'exam_break',
      'special',
      'other'
    ];

    // School-created holidays use school-specific types.
    // Official government holidays should be imported
    // through a separate verified process.
    const type = data.type || 'other';

    if (!allowedTypes.includes(type)) {
      throw new Error('Select a valid holiday type.');
    }

    if (!data.title?.trim() || !data.startDate) {
      throw new Error(
        'Enter a holiday name and start date.'
      );
    }

    if (
      data.endDate &&
      data.endDate < data.startDate
    ) {
      throw new Error(
        'End date must be after the start date.'
      );
    }

    return result(
      supabase
        .from('holidays')
        .insert({
          title: data.title.trim(),
          start_date: data.startDate,
          end_date: data.endDate || data.startDate,
          type,
          academic_year:
            data.academicYear ||
            `${Number(data.startDate.slice(0, 4))}-${Number(data.startDate.slice(0, 4)) + 1}`,
          description: data.description || null,
          applicable_to:
            data.applicableTo?.length
              ? data.applicableTo
              : [
                  'student',
                  'parent',
                  'teacher',
                  'principal',
                  'admin'
                ],
          is_active: true
        })
        .select('id')
        .single()
    );
  },

  // UPDATE SCHOOL HOLIDAY
  // Official public holidays are protected here.

  async updateHoliday(id, data) {
    await requireRole(['admin']);

    const allowedFields = [
      'title',
      'start_date',
      'end_date',
      'type',
      'academic_year',
      'description',
      'applicable_to',
      'is_active'
    ];

    const changes = Object.fromEntries(
      Object.entries(data || {}).filter(
        ([key]) => allowedFields.includes(key)
      )
    );

    if (!Object.keys(changes).length) {
      throw new Error('No holiday changes supplied.');
    }

    if (
      changes.type &&
      ![
        'other',
        'vacation',
        'exam_break',
        'special'
      ].includes(changes.type)
    ) {
      throw new Error(
        'Official public holidays cannot be changed here.'
      );
    }

    return result(
      supabase
        .from('holidays')
        .update(changes)
        .eq('id', id)
        .in('type', [
          'other',
          'vacation',
          'exam_break',
          'special'
        ])
        .select('id')
        .single()
    );
  },

  // DEACTIVATE SCHOOL HOLIDAY

  async deleteHoliday(id) {
    return this.updateHoliday(id, {
      is_active: false
    });
  },

  // ACCOUNT CREATION

  async provisionAccount(role, fields) {
    await requireRole(['admin']);

    const { data, error } =
      await supabase.functions.invoke(
        'create-portal-user',
        {
          body: { role, ...fields }
        }
      );

    if (error) {
      let message =
        'Account creation is unavailable. Please contact the school administrator.';

      try {
        const response =
          await error.context?.json();

        const messages = {
          duplicate_email:
            'An account with this email already exists.',
          invalid_class:
            'Select a class and division from the school catalog.',
          invalid_subject:
            'Select a subject from the school catalog.',
          invalid_details:
            'Check the required account details.',
          setup_required:
            'Account setup is not complete. Please ask the school system administrator to finish activation.',
          NOT_FOUND:
            'Account setup is not complete. Please ask the school system administrator to finish activation.',
          cleanup_required:
            'Account creation was incomplete. Please ask the school system administrator to review it before retrying.',
          creation_failed:
            'The account could not be created. Check the details and retry.',
          unauthorized:
            'Please sign in again.',
          forbidden:
            'Only an active administrator can create accounts.'
        };

        if (messages[response?.code]) {
          message = messages[response.code];
        }
      } catch {
        // Do not expose sensitive database errors.
      }

      throw new Error(message);
    }

    if (
      !data?.username ||
      !data?.temporaryPassword
    ) {
      throw new Error(
        'The account creation result could not be verified. Contact the administrator before retrying.'
      );
    }

    return data;
  },

  // RESET ACCOUNT PASSWORD

  async resetAccountPassword(userId) {
    await requireRole(['admin']);

    const { data, error } =
      await supabase.functions.invoke(
        'reset-portal-password',
        {
          body: { userId }
        }
      );

    if (
      error ||
      !data?.username ||
      !data?.temporaryPassword
    ) {
      throw new Error(
        'Unable to reset the password. Please retry or contact the school administrator.'
      );
    }

    return data;
  },

  async addStudent(fields) {
    return this.provisionAccount(
      'student',
      fields
    );
  },

  async addTeacher(fields) {
    return this.provisionAccount(
      'teacher',
      fields
    );
  },

  // CLASS AND SUBJECT OPTIONS

  async getProvisioningOptions() {
    await requireRole(['admin']);

    const [classes, subjects] =
      await Promise.all([
        list(
          supabase
            .from('classes')
            .select(
              'id,grade_level,division,academic_year'
            )
            .order('academic_year', {
              ascending: false
            })
            .order('grade_level')
            .order('division')
        ),

        list(
          supabase
            .from('subjects')
            .select('id,code,name')
            .order('name')
        )
      ]);

    return { classes, subjects };
  },

  // CLASSES

  async getClasses() {
    await requireRole([
      'admin',
      'principal'
    ]);

    return list(
      supabase
        .from('classes')
        .select(
          'id,grade_level,division,room_number,academic_year,students(count)'
        )
        .order('grade_level')
    );
  },

  // SCHOOL FEES

  async getSchoolFees() {
    await requireRole(['admin']);

    return list(
      supabase
        .from('fees')
        .select(
          'id,academic_year,total_amount,paid_amount,pending_amount,status'
        )
        .limit(1000)
    );
  },
  
async getAdmissionEnquiries() {
  await requireRole(['admin', 'principal']);

  return list(
    supabase
      .from('enquiries')
      .select(
        'id,guardian_name,guardian_email,child_name,child_age,class_grade,phone_number,message,status,created_at'
      )
      .order('created_at', { ascending: false })
      .limit(500)
  );
},

async updateAdmissionEnquiryStatus(id, status) {
  await requireRole(['admin']);

  const allowedStatuses = [
    'new',
    'contacted',
    'visit_scheduled',
    'admitted',
    'closed'
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid admission enquiry status.');
  }

  return result(
    supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select('id,status')
      .single()
  );
}


};
