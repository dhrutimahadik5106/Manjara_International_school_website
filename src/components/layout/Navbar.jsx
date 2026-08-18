import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const navItems = [
  {
    label: 'About Us',
    to: '/about',
    dropdown: [
      { label: 'About Manjara', to: '/about' },
      { label: 'Chairman\'s Message', to: '/about/chairman' },
      { label: 'BMSD Society', to: '/about/bmsd-society' },
      { label: 'Managing Team', to: '/managing-team' },
      { label: 'Awards & Recognition', to: '/about/awards' },
    ],
  },
  {
    label: 'Why Manjara',
    to: '/why-manjara/curriculum',
    dropdown: [
      { label: 'The Right Curriculum', to: '/why-manjara/curriculum' },
      { label: 'The Right Faculty', to: '/why-manjara/faculty' },
      { label: 'The Right Environment', to: '/why-manjara/environment' },
      { label: 'The Right Approach', to: '/why-manjara/approach' },
      { label: 'The Right Skills', to: '/why-manjara/skills' },
    ],
  },
  {
    label: 'Admissions',
    to: '/admissions',
    dropdown: [
      { label: 'Admissions', to: '/admissions' },
      { label: 'Admission AY 2026–27', to: '/admissions/ay-2026-27' },
      { label: 'Fee Structure', to: '/admissions/fee-structure' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Enquiry', to: '/admissions' },
    ],
  },
  { label: 'Facilities', to: '/facilities' },
  { label: 'News & Events', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Careers', to: '/careers' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Contact Us', to: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-200/80 bg-white/95 shadow-[0_14px_40px_-24px_rgba(18,59,93,0.28)] backdrop-blur' : 'border-b border-white/10 bg-[#0B2942]/95 text-white'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className={`flex items-center gap-3 text-sm font-semibold tracking-[0.02em] ${scrolled ? 'text-primary' : 'text-white'}`}>
          <img src={imageAssets.logo} alt="Manjara International School logo" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20" />
          <span className="leading-tight">Manjara International School</span>
        </NavLink>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition ${isActive || scrolled ? 'text-primary' : 'text-white'} ${!scrolled && !isActive ? 'text-white/90 hover:text-white' : 'hover:text-primary'}`}
              >
                {item.label}
                {item.dropdown ? <ChevronDown size={16} /> : null}
              </NavLink>
              <AnimatePresence>
                {item.dropdown && activeDropdown === item.label ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 top-full mt-3 w-56 rounded-[1.125rem] border border-slate-200/80 bg-white p-3 shadow-[0_18px_40px_-24px_rgba(18,59,93,0.28)]">
                    {item.dropdown.map((drop) => (
                      <NavLink key={drop.label} to={drop.to} className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-primary">
                        {drop.label}
                      </NavLink>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <NavLink to="/admissions" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${scrolled ? 'bg-primary text-white hover:bg-[#173b5a]' : 'bg-[#C7A45D] text-[#123B5D] hover:bg-[#b8924d]'}`}>
            Enquire Now
          </NavLink>
        </div>

        <button onClick={() => setMobileOpen(true)} className={`rounded-full p-2 lg:hidden ${scrolled ? 'text-primary' : 'text-white'}`} aria-label="Open navigation">
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-slate-950/70 lg:hidden" onClick={() => setMobileOpen(false)}>
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} className="ml-auto flex h-full w-80 flex-col bg-white p-6 shadow-[0_20px_60px_-28px_rgba(18,59,93,0.35)]" onClick={(e) => e.stopPropagation()}>
              <div className="mb-8 flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 text-slate-600 hover:bg-slate-100" aria-label="Close navigation">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <NavLink key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-primary">
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
