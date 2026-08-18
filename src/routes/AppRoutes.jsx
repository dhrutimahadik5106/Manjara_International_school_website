import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import Loader from '../components/common/Loader.jsx';

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
const AdminPage = lazy(() => import('../pages/Admin/index.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFound/index.jsx'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
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
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
