import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import Loader from '../components/common/Loader.jsx';
import ProtectedRoute from '../components/portal/ProtectedRoute.jsx';

// Public Web Pages
const HomePage = lazy(() => import('../pages/Home/index.jsx'));
const AboutPage = lazy(() => import('../pages/About/index.jsx'));
const ChairmanPage = lazy(() => import('../pages/About/ChairmanMessage/index.jsx'));
const BmsdSocietyPage = lazy(() => import('../pages/About/BmsdSociety/index.jsx'));
const AwardsPage = lazy(() => import('../pages/About/Awards/index.jsx'));
const AcademicsPage = lazy(() => import('../pages/Academics/index.jsx'));
const AdmissionsPage = lazy(() => import('../pages/Admission/index.jsx'));
const AdmissionAyPage = lazy(() => import('../pages/Admissions/Ay2026/index.jsx'));
const FeeStructurePage = lazy(() => import('../pages/Admissions/FeeStructure/index.jsx'));
const FacilitiesPage = lazy(() => import('../pages/facilities/index.jsx'));
const GalleryPage = lazy(() => import('../pages/Gallery/index.jsx'));
const NewsPage = lazy(() => import('../pages/News/index.jsx'));
const ContactPage = lazy(() => import('../pages/Contact/index.jsx'));
const CareersPage = lazy(() => import('../pages/Careers/index.jsx'));
const AlumniPage = lazy(() => import('../pages/Alumni/index.jsx'));
const ManagingTeamPage = lazy(() => import('../pages/ManagingTeam/index.jsx'));
const LocationPage = lazy(() => import('../pages/Location/index.jsx'));
const FaqPage = lazy(() => import('../pages/Faq/index.jsx'));
const CurriculumPage = lazy(() => import('../pages/WhyManjara/Curriculum/index.jsx'));
const FacultyPage = lazy(() => import('../pages/WhyManjara/Faculty/index.jsx'));
const EnvironmentPage = lazy(() => import('../pages/WhyManjara/Environment/index.jsx'));
const ApproachPage = lazy(() => import('../pages/WhyManjara/Approach/index.jsx'));
const SkillsPage = lazy(() => import('../pages/WhyManjara/Skills/index.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFound/index.jsx'));

const ChangePassword = lazy(() => import('../pages/Portal/ChangePassword.jsx'));

// Portal Common
const PortalPage = lazy(() => import('../pages/Portal/index.jsx'));
const LoginPage = lazy(() => import('../pages/Portal/LoginPage.jsx'));

// Portal — Student
const StudentDashboard = lazy(() => import('../pages/Portal/Student/StudentDashboard.jsx'));
const StudentProfile = lazy(() => import('../pages/Portal/Student/StudentProfile.jsx'));
const StudentAttendance = lazy(() => import('../pages/Portal/Student/StudentAttendance.jsx'));
const StudentTimetable = lazy(() => import('../pages/Portal/Student/StudentTimetable.jsx'));
const StudentAssignments = lazy(() => import('../pages/Portal/Student/StudentAssignments.jsx'));
const StudentResults = lazy(() => import('../pages/Portal/Student/StudentResults.jsx'));
const StudentCalendar = lazy(() => import('../pages/Portal/Student/StudentCalendar.jsx'));
const StudentNotices = lazy(() => import('../pages/Portal/Student/StudentNotices.jsx'));
const StudentMaterials = lazy(() => import('../pages/Portal/Student/StudentMaterials.jsx'));


// Portal — Teacher
const TeacherDashboard = lazy(() => import('../pages/Portal/Teacher/TeacherDashboard.jsx'));
const TeacherClasses = lazy(() => import('../pages/Portal/Teacher/TeacherClasses.jsx'));
const TeacherAttendance = lazy(() => import('../pages/Portal/Teacher/TeacherAttendance.jsx'));
const TeacherMyAttendance = lazy(() => import('../pages/Portal/Teacher/TeacherMyAttendance.jsx'));
const TeacherAssignments = lazy(() => import('../pages/Portal/Teacher/TeacherAssignments.jsx'));
const TeacherMaterials = lazy(() => import('../pages/Portal/Teacher/TeacherMaterials.jsx'));
const TeacherTimetable = lazy(() => import('../pages/Portal/Teacher/TeacherTimetable.jsx'));
const TeacherResults = lazy(() =>
  import('../pages/Portal/Teacher/TeacherResults.jsx')
);
const TeacherCalendar = lazy(() => import('../pages/Portal/Teacher/TeacherCalendar.jsx'));

// Portal — Principal
const PrincipalDashboard = lazy(() => import('../pages/Portal/Principal/PrincipalDashboard.jsx'));
const PrincipalDirectory = lazy(() => import('../pages/Portal/Principal/PrincipalDirectory.jsx'));
const PrincipalAttendance = lazy(() => import('../pages/Portal/Principal/PrincipalAttendance.jsx'));
const PrincipalAcademics = lazy(() => import('../pages/Portal/Principal/PrincipalAcademics.jsx'));
const PrincipalNotices = lazy(() => import('../pages/Portal/Principal/PrincipalNotices.jsx'));
const PrincipalReports = lazy(() => import('../pages/Portal/Principal/PrincipalReports.jsx'));
const PrincipalCalendar = lazy(() => import('../pages/Portal/Principal/PrincipalCalendar.jsx'));

// Portal — Admin
const AdminDashboard = lazy(() => import('../pages/Portal/Admin/AdminDashboard.jsx'));
const AdminStudents = lazy(() => import('../pages/Portal/Admin/AdminStudents.jsx'));
const AdminTeachers = lazy(() => import('../pages/Portal/Admin/AdminTeachers.jsx'));
const AdminClasses = lazy(() => import('../pages/Portal/Admin/AdminClasses.jsx'));
const AdminCalendar = lazy(() => import('../pages/Portal/Admin/AdminCalendar.jsx'));
const AdminEnquiries = lazy(() => import('../pages/Portal/Admin/AdminEnquiries.jsx'));
const AdminTimetable = lazy(() => import('../pages/Portal/Admin/AdminTimetable.jsx'));
const AdminFees = lazy(() => import('../pages/Portal/Admin/AdminFees.jsx'));
const AdminNotices = lazy(() => import('../pages/Portal/Admin/AdminNotices.jsx'));
const AdminAudit = lazy(() => import('../pages/Portal/Admin/AdminAudit.jsx'));


const EventsPage = lazy(() => import('../pages/Portal/EventsPage.jsx'));
const MessagesPage = lazy(() => import('../pages/Portal/MessagesPage.jsx'));
const ProfilePage = lazy(() => import('../pages/Portal/ProfilePage.jsx'));
const TeacherNotices = lazy(() => import('../pages/Portal/Teacher/TeacherNotices.jsx'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="about/chairman" element={<ChairmanPage />} />
          <Route path="about/bmsd-society" element={<BmsdSocietyPage />} />
          <Route path="about/awards" element={<AwardsPage />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="admissions/ay-2026-27" element={<AdmissionAyPage />} />
          <Route path="admissions/fee-structure" element={<FeeStructurePage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="alumni" element={<AlumniPage />} />
          <Route path="managing-team" element={<ManagingTeamPage />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="why-manjara/curriculum" element={<CurriculumPage />} />
          <Route path="why-manjara/faculty" element={<FacultyPage />} />
          <Route path="why-manjara/environment" element={<EnvironmentPage />} />
          <Route path="why-manjara/approach" element={<ApproachPage />} />
          <Route path="why-manjara/skills" element={<SkillsPage />} />
          <Route path="portal" element={<PortalPage />} />
        </Route>

        {/* Portal Authentication Route */}
        <Route path="/portal/change-password" element={<ProtectedRoute allowedRoles={['student','teacher']} allowPasswordChange><ChangePassword /></ProtectedRoute>} />
        <Route path="/portal/login" element={<LoginPage />} />

        {/* Portal — Student Protected Routes */}
        <Route path="/portal/student" element={<ProtectedRoute allowedRoles={['student']}><Navigate to="/portal/student/dashboard" replace /></ProtectedRoute>} />
        <Route path="/portal/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/portal/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/portal/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><StudentAttendance /></ProtectedRoute>} />
        <Route path="/portal/student/timetable" element={<ProtectedRoute allowedRoles={['student']}><StudentTimetable /></ProtectedRoute>} />
        <Route path="/portal/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><StudentAssignments /></ProtectedRoute>} />
        <Route path="/portal/student/results" element={<ProtectedRoute allowedRoles={['student']}><StudentResults /></ProtectedRoute>} />
        <Route path="/portal/student/calendar" element={<ProtectedRoute allowedRoles={['student']}><StudentCalendar /></ProtectedRoute>} />
        <Route path="/portal/student/notices" element={<ProtectedRoute allowedRoles={['student']}><StudentNotices /></ProtectedRoute>} />
        <Route path="/portal/student/materials" element={<ProtectedRoute allowedRoles={['student']}><StudentMaterials /></ProtectedRoute>} />


        {/* Portal — Teacher Protected Routes */}
        <Route path="/portal/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><Navigate to="/portal/teacher/dashboard" replace /></ProtectedRoute>} />
        <Route path="/portal/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/portal/teacher/classes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClasses /></ProtectedRoute>} />
        <Route path="/portal/teacher/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAttendance /></ProtectedRoute>} />
        <Route
  path="/portal/teacher/my-attendance"
  element={
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherMyAttendance />
    </ProtectedRoute>
  }
/>
        <Route path="/portal/teacher/assignments" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAssignments /></ProtectedRoute>} />
        <Route
  path="/portal/teacher/results"
  element={
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherResults />
    </ProtectedRoute>
  }
/>
        <Route path="/portal/teacher/calendar" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCalendar /></ProtectedRoute>} />
        <Route path="/portal/teacher/materials" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherMaterials /></ProtectedRoute>} />
        <Route path="/portal/teacher/timetable" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherTimetable /></ProtectedRoute>} />

        {/* Portal — Principal Protected Routes */}
        <Route path="/portal/principal" element={<ProtectedRoute allowedRoles={['principal']}><Navigate to="/portal/principal/dashboard" replace /></ProtectedRoute>} />
        <Route path="/portal/principal/dashboard" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
        <Route path="/portal/principal/directory" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDirectory /></ProtectedRoute>} />
        <Route path="/portal/principal/attendance" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalAttendance /></ProtectedRoute>} />
        <Route path="/portal/principal/academics" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalAcademics /></ProtectedRoute>} />
        <Route path="/portal/principal/calendar" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalCalendar /></ProtectedRoute>} />
        <Route path="/portal/principal/notices" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalNotices /></ProtectedRoute>} />
        <Route path="/portal/principal/reports" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalReports /></ProtectedRoute>} />

        {/* Portal — Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Navigate to="/portal/admin/dashboard" replace /></ProtectedRoute>} />
        <Route path="/portal/admin" element={<ProtectedRoute allowedRoles={['admin']}><Navigate to="/portal/admin/dashboard" replace /></ProtectedRoute>} />
        <Route path="/portal/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/portal/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudents /></ProtectedRoute>} />
        <Route path="/portal/admin/teachers" element={<ProtectedRoute allowedRoles={['admin']}><AdminTeachers /></ProtectedRoute>} />
        <Route
  path="/portal/admin/timetable"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminTimetable />
    </ProtectedRoute>
  }
/>
        <Route path="/portal/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><AdminClasses /></ProtectedRoute>} />
        <Route path="/portal/admin/calendar" element={<ProtectedRoute allowedRoles={['admin']}><AdminCalendar /></ProtectedRoute>} />
        
        <Route
  path="/portal/admin/enquiries"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminEnquiries />
    </ProtectedRoute>
  }
/>
        <Route path="/portal/admin/fees" element={<ProtectedRoute allowedRoles={['admin']}><AdminFees /></ProtectedRoute>} />
        <Route path="/portal/admin/notices" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotices /></ProtectedRoute>} />
        <Route path="/portal/admin/audit" element={<ProtectedRoute allowedRoles={['admin']}><AdminAudit /></ProtectedRoute>} />

        <Route path="/portal/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><EventsPage /></ProtectedRoute>} />
        <Route path="/portal/student/events" element={<ProtectedRoute allowedRoles={['student']}><EventsPage /></ProtectedRoute>} />
        <Route path="/portal/student/messages" element={<ProtectedRoute allowedRoles={['student']}><MessagesPage /></ProtectedRoute>} />
        <Route path="/portal/teacher/events" element={<ProtectedRoute allowedRoles={['teacher']}><EventsPage /></ProtectedRoute>} />
        <Route path="/portal/teacher/messages" element={<ProtectedRoute allowedRoles={['teacher']}><MessagesPage /></ProtectedRoute>} />
        <Route path="/portal/principal/events" element={<ProtectedRoute allowedRoles={['principal']}><EventsPage /></ProtectedRoute>} />
        <Route path="/portal/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/portal/principal/profile" element={<ProtectedRoute allowedRoles={['principal']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/portal/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/portal/teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClasses /></ProtectedRoute>} />
        <Route path="/portal/teacher/notices" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherNotices /></ProtectedRoute>} />
        <Route path="/portal/principal/students" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDirectory /></ProtectedRoute>} />
        <Route path="/portal/principal/teachers" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDirectory /></ProtectedRoute>} />

        {/* Catch-all 404 */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
