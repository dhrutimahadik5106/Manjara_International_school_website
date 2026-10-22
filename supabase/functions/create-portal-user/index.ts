import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

// Supabase Edge Function: create-portal-user
// Requires the public.generate_student_id() RPC and the students parent-name columns.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const reply = (status: number, body: object) => new Response(JSON.stringify(body), {
  status,
  headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

const cleanText = (value: unknown, maxLength = 255): string =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
const optionalText = (value: unknown, maxLength = 255): string | null =>
  cleanText(value, maxLength) || null;

const validDate = (value: unknown): boolean => {
  if (!value) return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (request.method !== 'POST') return reply(405, { error: 'Method not allowed.' });

  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return reply(503, { code: 'setup_required', error: 'Account setup is incomplete.' });

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = request.headers.get('Authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return reply(401, { code: 'unauthorized', error: 'Authentication required.' });

  const { data: identity, error: authError } = await admin.auth.getUser(token);
  if (authError || !identity.user) {
    return reply(401, { code: 'unauthorized', error: 'Authentication required.' });
  }
  const { data: caller, error: callerError } = await admin
    .from('profiles').select('role,is_active').eq('id', identity.user.id).single();
  if (callerError || caller?.role !== 'admin' || caller.is_active !== true) {
    return reply(403, { code: 'forbidden', error: 'Admin access required.' });
  }

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 16384) {
      return reply(413, { code: 'invalid_details', error: 'Request too large.' });
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
    input = parsed as Record<string, unknown>;
  } catch {
    return reply(400, { code: 'invalid_details', error: 'Invalid request.' });
  }

  const role = input.role;
  const email = cleanText(input.email, 254).toLowerCase();
  const fullName = cleanText(input.fullName, 150);
  if (!['student', 'teacher'].includes(String(role)) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName) {
    return reply(400, { code: 'invalid_details', error: 'Enter a valid role, name and email.' });
  }

  const { data: existing, error: lookupError } = await admin
    .from('profiles').select('id').eq('email', email).maybeSingle();
  if (lookupError) return reply(503, { code: 'setup_required', error: 'Account setup is incomplete.' });
  if (existing) return reply(409, { code: 'duplicate_email', error: 'An account with this email already exists.' });

  let classId: string | null = null;
  const teacherAssignments: { class_id: string; subject_id: string }[] = [];

  if (role === 'student') {
    if (typeof input.classId !== 'string' || !input.classId) {
      return reply(400, { code: 'invalid_class', error: 'Select a class and division.' });
    }
    const rollNumber = Number(input.rollNumber);
    if (!Number.isSafeInteger(rollNumber) || rollNumber < 1 || input.rollNumber == null || input.rollNumber === '') {
      return reply(400, { code: 'invalid_details', error: 'A valid roll number is required.' });
    }
    if (!validDate(input.dob)) {
      return reply(400, { code: 'invalid_details', error: 'Enter a valid date of birth.' });
    }
    const { data: schoolClass, error: classError } = await admin
      .from('classes').select('id').eq('id', input.classId).single();
    if (classError || !schoolClass) {
      return reply(400, { code: 'invalid_class', error: 'Select an existing class and division.' });
    }
    classId = schoolClass.id;
  } else {
    if (!Array.isArray(input.assignedClasses) || input.assignedClasses.length > 30) {
      return reply(400, { code: 'invalid_details', error: 'Invalid class assignments.' });
    }
    for (const row of input.assignedClasses) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        return reply(400, { code: 'invalid_details', error: 'Invalid teacher assignment.' });
      }
      const assignment = row as Record<string, unknown>;
      const classQuery = assignment.classId
        ? admin.from('classes').select('id').eq('id', assignment.classId)
        : admin.from('classes').select('id')
            .eq('grade_level', assignment.grade)
            .eq('division', assignment.division)
            .eq('academic_year', assignment.academicYear || '2026-2027');
      const subjectQuery = assignment.subjectId
        ? admin.from('subjects').select('id').eq('id', assignment.subjectId)
        : admin.from('subjects').select('id').eq('name', assignment.subject);
      const [{ data: schoolClass, error: classError }, { data: subject, error: subjectError }] =
        await Promise.all([classQuery.single(), subjectQuery.single()]);
      if (classError || !schoolClass) {
        return reply(400, { code: 'invalid_class', error: 'Select an existing class and division.' });
      }
      if (subjectError || !subject) {
        return reply(400, { code: 'invalid_subject', error: 'Select an existing subject.' });
      }
      teacherAssignments.push({ class_id: schoolClass.id, subject_id: subject.id });
    }
  }

  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const temporaryPassword = 'Aa9!' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  const { data: created, error: creationError } = await admin.auth.admin.createUser({
    email, password: temporaryPassword, email_confirm: true,
  });
  if (creationError || !created.user) {
    const duplicate = ['email_exists', 'user_already_exists'].includes(creationError?.code || '');
    return reply(duplicate ? 409 : 400, {
      code: duplicate ? 'duplicate_email' : 'creation_failed',
      error: duplicate ? 'An account with this email already exists.' : 'Account creation failed.',
    });
  }

  const userId = created.user.id;
  let savedStudentId: string | null = null;
  try {
    const { data: profile, error: profileError } = await admin.from('profiles')
      .upsert({
        id: userId, full_name: fullName, email, role,
        phone_number: optionalText(input.phone, 30), is_active: true,
        must_change_password: true, password_change_token: crypto.randomUUID(),
      }, { onConflict: 'id' }).select('username').single();
    if (profileError || !profile?.username) throw new Error('profile');

    if (role === 'student') {
      // RPC executes on the server with service-role credentials.
      const { data: generatedId, error: idError } = await admin.rpc('generate_student_id');
      if (idError || typeof generatedId !== 'string' || !generatedId) throw new Error('student_id_generation');

      const { data: student, error: studentError } = await admin.from('students')
        .insert({
          user_id: userId, student_id: generatedId, class_id: classId,
          roll_number: Number(input.rollNumber), date_of_birth: input.dob || null,
          blood_group: optionalText(input.bloodGroup, 10),
          address: optionalText(input.address, 1000),
          father_name: optionalText(input.fatherName, 150),
          mother_name: optionalText(input.motherName, 150),
        }).select('student_id').single();
      if (studentError || !student) throw new Error('student');
      savedStudentId = student.student_id;
    } else {
      const { data: teacher, error: teacherError } = await admin.from('teachers')
        .insert({
          user_id: userId,
          employee_id: optionalText(input.employeeId, 80) || `MIS-EMP-${crypto.randomUUID()}`,
          qualification: optionalText(input.qualification, 255),
          specialization: optionalText(input.specialization, 255),
        }).select('id').single();
      if (teacherError || !teacher) throw new Error('teacher');
      if (teacherAssignments.length) {
        const { error: assignmentError } = await admin.from('teacher_class_assignments')
          .insert(teacherAssignments.map(a => ({ ...a, teacher_id: teacher.id })));
        if (assignmentError) throw new Error('assignments');
      }
    }

    return reply(201, {
      id: userId, fullName, email, role, username: profile.username,
      studentId: savedStudentId, temporaryPassword,
    });
  } catch {
    // Best-effort cleanup. Verify that auth-user deletion cascades to the school tables.
    const { error: cleanupError } = await admin.auth.admin.deleteUser(userId);
    return reply(500, {
      code: cleanupError ? 'cleanup_required' : 'creation_failed',
      error: cleanupError
        ? 'Account creation was incomplete. An administrator must review the account.'
        : 'Account creation failed. Verify account state before retrying.',
      ...(cleanupError ? { accountId: userId } : {}),
    });
  }
});
