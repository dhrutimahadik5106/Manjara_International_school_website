import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from '../common/ScrollToTop.jsx';
import AnnouncementBar from '../common/AnnouncementBar.jsx';
import FloatingActions from '../common/FloatingActions.jsx';

const Layout = () => {
  const location = useLocation();

  return (
    <div id="top" className="min-h-screen bg-background text-text">
      <AnnouncementBar />
      <Navbar />
      <main className="pt-0">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingActions />
    </div>
  );
};

export default Layout;
