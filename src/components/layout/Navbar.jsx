
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const navItems = [
  {
    label: 'About Us',
    to: '/about',
    dropdown: [
      { label: 'About Manjara', to: '/about' },
      { label: "Chairman's Message", to: '/about/chairman' },
      { label: 'BMSD Society', to: '/about/bmsd-society' },
      { label: 'Managing Team', to: '/managing-team' },
      { label: 'Awards & Recognition', to: '/about/awards' }
    ]
  },
  {
    label: 'Why Manjara',
    to: '/why-manjara/curriculum',
    dropdown: [
      { label: 'The Right Curriculum', to: '/why-manjara/curriculum' },
      { label: 'The Right Faculty', to: '/why-manjara/faculty' },
      { label: 'The Right Environment', to: '/why-manjara/environment' },
      { label: 'The Right Approach', to: '/why-manjara/approach' },
      { label: 'The Right Skills', to: '/why-manjara/skills' }
    ]
  },
  {
    label: 'Admissions',
    to: '/admissions',
    dropdown: [
      { label: 'Admissions Overview', to: '/admissions' },
      { label: 'Admission AY 2026–27', to: '/admissions/ay-2026-27' },
      { label: 'Fee Structure', to: '/admissions/fee-structure' },
      { label: 'FAQ', to: '/faq' }
    ]
  },
  { label: 'Facilities', to: '/facilities' },
  { label: 'News & Events', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Careers', to: '/careers' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Contact Us', to: '/contact' }
];

const dropdownAnimation = {
  initial: {
    opacity: 0,
    y: -6,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.14,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeIn'
    }
  }
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setExpandedMobileGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const toggleMobileGroup = (label) => {
    setExpandedMobileGroup((previous) =>
      previous === label ? null : label
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,color,box-shadow] duration-200 ${
        scrolled
          ? 'bg-white/95 text-mis-navy shadow-header border-b border-slate-200/80 backdrop-blur-md'
          : 'bg-mis-navy/95 text-white border-b border-white/10 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* SCHOOL LOGO */}
        <NavLink
          to="/"
          onMouseEnter={() => setActiveDropdown(null)}
          className={`flex items-center gap-3 font-bold tracking-tight transition-opacity hover:opacity-90 ${
            scrolled ? 'text-mis-navy' : 'text-white'
          }`}
          aria-label="Manjara International School Home"
        >
          <img
            src={imageAssets.logo}
            alt="Manjara International School logo"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-mis-gold/40 shadow-sm"
          />

          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-wide">
              MANJARA
            </span>

            <span className="text-[10px] font-semibold tracking-wider opacity-85 text-mis-gold uppercase">
              International School
            </span>
          </div>
        </NavLink>

        {/* DESKTOP NAVIGATION */}
        <nav
          className="hidden items-center gap-1 xl:gap-2 lg:flex"
          aria-label="Main Navigation"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {navItems.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const isOpen = activeDropdown === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  setActiveDropdown(
                    hasDropdown ? item.label : null
                  )
                }
                onFocus={() => {
                  if (hasDropdown) {
                    setActiveDropdown(item.label);
                  }
                }}
              >
                <NavLink
                  to={item.to}
                  onClick={() => setActiveDropdown(null)}
                  aria-haspopup={hasDropdown ? 'menu' : undefined}
                  aria-expanded={hasDropdown ? isOpen : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors duration-100 ${
                      scrolled
                        ? isActive
                          ? 'text-mis-blue bg-mis-soft/80 font-bold'
                          : 'text-slate-700 hover:text-mis-blue hover:bg-slate-50'
                        : isActive
                          ? 'text-mis-gold bg-white/10 font-bold'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <span>{item.label}</span>

                  {hasDropdown && (
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform duration-150 ease-out ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  )}
                </NavLink>

                {/* FAST DESKTOP DROPDOWN */}
                <AnimatePresence initial={false}>
                  {hasDropdown && isOpen && (
                    <motion.div
                      key={`${item.label}-dropdown`}
                      variants={dropdownAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{
                        transformOrigin: 'top left'
                      }}
                      className="absolute left-0 top-full z-[60] w-60 pt-1"
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                        {item.dropdown.map((drop) => (
                          <NavLink
                            key={drop.label}
                            to={drop.to}
                            onClick={() =>
                              setActiveDropdown(null)
                            }
                            className={({ isActive }) =>
                              `block rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors duration-100 ${
                                isActive
                                  ? 'bg-mis-soft text-mis-blue font-bold'
                                  : 'text-slate-700 hover:bg-sky-50 hover:text-mis-blue'
                              }`
                            }
                          >
                            {drop.label}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* DESKTOP ACTION BUTTONS */}
        <div
          className="hidden items-center gap-2.5 lg:flex"
          onMouseEnter={() => setActiveDropdown(null)}
        >
          <NavLink
            to="/portal"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-mis-navy bg-mis-soft hover:bg-sky-100 border border-mis-blue/20 transition-all duration-150 shadow-sm"
          >
            <GraduationCap
              size={15}
              className="text-mis-blue"
            />
            <span>School Portal</span>
          </NavLink>

          <NavLink
            to="/admissions"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-mis-navy bg-mis-gold hover:bg-amber-400 transition-all duration-150 shadow-sm"
          >
            <Sparkles size={14} />
            <span>Enquire Now</span>
          </NavLink>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`rounded-xl p-2.5 lg:hidden transition-colors ${
            scrolled
              ? 'text-mis-navy hover:bg-slate-100'
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Open Mobile Menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 36
              }}
              className="ml-auto flex h-full w-80 max-w-[90vw] flex-col overflow-y-auto bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* DRAWER HEADER */}
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={imageAssets.logo}
                    alt="MIS Logo"
                    className="h-8 w-8 rounded-full"
                  />

                  <span className="text-base font-bold text-mis-navy">
                    MIS Navigation
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>

              {/* MOBILE ACTION BUTTONS */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                <NavLink
                  to="/portal"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-mis-blue/20 bg-mis-soft px-3 py-2.5 text-xs font-bold text-mis-navy"
                >
                  <GraduationCap
                    size={15}
                    className="text-mis-blue"
                  />
                  Portal
                </NavLink>

                <NavLink
                  to="/admissions"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-mis-gold px-3 py-2.5 text-xs font-bold text-mis-navy"
                >
                  <Sparkles size={14} />
                  Enquire
                </NavLink>
              </div>

              {/* MOBILE NAVIGATION LINKS */}
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const hasDropdown = Boolean(item.dropdown);
                  const isExpanded =
                    expandedMobileGroup === item.label;

                  return (
                    <div
                      key={item.label}
                      className="border-b border-slate-100/80 pb-1"
                    >
                      {hasDropdown ? (
                        <div className="flex items-center justify-between">
                          <NavLink
                            to={item.to}
                            onClick={() =>
                              setMobileOpen(false)
                            }
                            className="flex-1 px-3 py-2.5 text-sm font-semibold text-slate-800 hover:text-mis-blue"
                          >
                            {item.label}
                          </NavLink>

                          <button
                            type="button"
                            onClick={() =>
                              toggleMobileGroup(item.label)
                            }
                            aria-expanded={isExpanded}
                            aria-label={`Toggle ${item.label} menu`}
                            className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-150 ${
                                isExpanded
                                  ? 'rotate-180'
                                  : 'rotate-0'
                              }`}
                            />
                          </button>
                        </div>
                      ) : (
                        <NavLink
                          to={item.to}
                          onClick={() =>
                            setMobileOpen(false)
                          }
                          className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:text-mis-blue"
                        >
                          {item.label}
                        </NavLink>
                      )}

                      {/* ANIMATED MOBILE SUBMENU */}
                      <AnimatePresence initial={false}>
                        {hasDropdown && isExpanded && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0
                            }}
                            animate={{
                              height: 'auto',
                              opacity: 1
                            }}
                            exit={{
                              height: 0,
                              opacity: 0
                            }}
                            transition={{
                              duration: 0.16,
                              ease: 'easeOut'
                            }}
                            className="overflow-hidden"
                          >
                            <div className="ml-3 mt-1 flex flex-col space-y-1 border-l-2 border-mis-soft pb-2 pl-3">
                              {item.dropdown.map((drop) => (
                                <NavLink
                                  key={drop.label}
                                  to={drop.to}
                                  onClick={() =>
                                    setMobileOpen(false)
                                  }
                                  className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-100 hover:bg-sky-50 hover:text-mis-blue"
                                >
                                  {drop.label}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* MOBILE FOOTER */}
              <div className="mt-auto border-t border-slate-100 pt-6 text-center">
                <span className="text-[11px] text-slate-400">
                  UDISE Code:{' '}
                  <strong className="text-slate-600">
                    27280101009
                  </strong>
                </span>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
