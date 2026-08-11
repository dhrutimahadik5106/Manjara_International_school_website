import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import Loader from '../components/common/Loader.jsx';

const HomePage = lazy(() => import('../pages/Home/index.jsx'));
const AboutPage = lazy(() => import('../pages/About/index.jsx'));
const AcademicsPage = lazy(() => import('../pages/Academics/index.jsx'));
const AdmissionsPage = lazy(() => import('../pages/Admission/index.jsx'));
const FacilitiesPage = lazy(() => import('../pages/facilities/index.jsx'));
const GalleryPage = lazy(() => import('../pages/Gallery/index.jsx'));
const NewsPage = lazy(() => import('../pages/News/index.jsx'));
const ContactPage = lazy(() => import('../pages/Contact/index.jsx'));
const AdminPage = lazy(() => import('../pages/Admin/index.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFound/index.jsx'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
