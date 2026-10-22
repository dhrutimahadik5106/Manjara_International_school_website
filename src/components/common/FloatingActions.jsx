
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHATSAPP_MESSAGE =
  'Hello Manjara International School, I would like to enquire about admission for my child. Please share the admission process, available classes and fee details. Thank you.';

const WHATSAPP_URL =
  `https://wa.me/919175518919?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleQuickEnquiry = () => {
    // Ensure the Admissions page opens at the top.
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      <div className="pointer-events-auto flex flex-col items-end gap-3">

        {/* WHATSAPP BUTTON */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Manjara International School on WhatsApp for admission enquiry"
          className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-[#20ba5a]"
        >
          <MessageCircle
            size={19}
            className="fill-white/20"
          />

          <span className="hidden sm:inline">
            WhatsApp Us
          </span>
        </motion.a>

        {/* QUICK ENQUIRY BUTTON */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/admissions"
            onClick={handleQuickEnquiry}
            aria-label="Quick Admissions Enquiry"
            className="flex items-center gap-2 rounded-full border border-mis-gold/30 bg-mis-navy px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition-colors hover:bg-mis-blue-dark"
          >
            <Sparkles
              size={18}
              className="text-mis-gold"
            />

            <span className="hidden sm:inline">
              Quick Enquiry
            </span>
          </Link>
        </motion.div>

        {/* SCROLL TO TOP BUTTON */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              type="button"
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.8
              }}
              whileHover={{
                scale: 1.1
              }}
              whileTap={{
                scale: 0.9
              }}
              onClick={scrollToTop}
              aria-label="Back to top of page"
              className="rounded-full border border-slate-200 bg-white p-3 text-mis-navy shadow-md transition-colors hover:bg-mis-soft"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FloatingActions;
