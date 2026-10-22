
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  ExternalLink,
  Facebook,
  Youtube,
  Instagram
} from 'lucide-react';
import { imageAssets } from '../../data/images';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Why Manjara', href: '/why-manjara/curriculum' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'School Portal', href: '/portal' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'News & Events', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Contact Us', href: '/contact' }
];

// OFFICIAL SCHOOL CONTACT DETAILS
const SCHOOL_EMAIL = 'manjaraschool@gmail.com';

const SCHOOL_ADDRESS =
  'Khadgaon–Pakharsangvi Road, Latur, Maharashtra 413531';

const SCHOOL_MAP_URL =
  'https://maps.app.goo.gl/BAqk1zw3qpHaC3oXA';

const ADMISSION_HELPLINES = [
  {
    label: '+91 9175518919',
    phone: '+919175518919'
  },
  {
    label: '+91 9130722285',
    phone: '+919130722285'
  },
  {
    label: '+91 8830005678',
    phone: '+918830005678'
  }
];

const WHATSAPP_NUMBER = '+91 9175518919';

const WHATSAPP_MESSAGE =
  'Hello Manjara International School, I would like to enquire about admission for my child. Please share the admission process, available classes and fee details. Thank you.';

const WHATSAPP_URL =
  `https://wa.me/919175518919?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

// OFFICIAL SOCIAL MEDIA LINKS
const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/manjarainternationalschool',
    icon: Facebook
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@sidheshwarbellale',
    icon: Youtube
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/manjara.international.school_/',
    icon: Instagram
  }
];

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    // Newsletter backend is not yet connected.
    // Redirect to the official school email instead.
    const subject = encodeURIComponent(
      'Request to Receive MIS School Announcements'
    );

    const body = encodeURIComponent(
      `Hello Manjara International School,\n\nI would like to receive school announcements at this email address:\n${newsletterEmail}\n\nThank you.`
    );

    window.location.href =
      `mailto:${SCHOOL_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="border-t border-slate-800 bg-mis-navy text-slate-300">

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">

        {/* BRAND AND CONTACT DETAILS */}
        <div className="space-y-5">

          {/* SCHOOL BRAND */}
          <div className="flex items-center gap-3">
            <img
              src={imageAssets.logo}
              alt="Manjara International School Logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-mis-gold/40"
            />

            <div>
              <p className="text-lg font-extrabold text-white">
                Manjara International School
              </p>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-mis-gold">
                Latur, Maharashtra
              </p>
            </div>
          </div>

          {/* SCHOOL DESCRIPTION */}
          <p className="max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
            Rising Towards Excellence — a premium,
            future-ready learning environment rooted in
            care, character, and academic depth.
          </p>

          {/* CONTACT INFORMATION */}
          <div className="space-y-3 text-xs text-slate-300 sm:text-sm">

            {/* SCHOOL ADDRESS */}
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-mis-gold"
              />

              <a
                href={SCHOOL_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 transition-colors hover:text-white"
              >
                <span>{SCHOOL_ADDRESS}</span>
                <ExternalLink
                  size={13}
                  className="mt-0.5 shrink-0"
                />
              </a>
            </div>

            {/* ADMISSION HELPLINES */}
            <div className="flex items-start gap-3">
              <Phone
                size={16}
                className="mt-0.5 shrink-0 text-mis-gold"
              />

              <div className="space-y-2">
                <p className="font-bold text-white">
                  Admission Helplines
                </p>

                {ADMISSION_HELPLINES.map((item) => (
                  <a
                    key={item.phone}
                    href={`tel:${item.phone}`}
                    className="block transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* OFFICIAL EMAIL */}
            <div className="flex items-center gap-3">
              <Mail
                size={16}
                className="shrink-0 text-mis-gold"
              />

              <a
                href={`mailto:${SCHOOL_EMAIL}`}
                className="break-all transition-colors hover:text-white"
              >
                {SCHOOL_EMAIL}
              </a>
            </div>

            {/* WHATSAPP ADMISSION SUPPORT */}
            <div className="flex items-center gap-3">
              <MessageCircle
                size={16}
                className="shrink-0 text-[#25D366]"
              />

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors hover:text-emerald-400"
              >
                WhatsApp Admission Enquiry: {WHATSAPP_NUMBER}
              </a>
            </div>

          </div>

          {/* SOCIAL MEDIA LINKS */}
          <div className="pt-2">

            <h4 className="mb-3 text-sm font-bold text-white">
              Follow Us
            </h4>

            <div className="flex items-center gap-3">

              {socialLinks.map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${name} page`}
                  title={name}
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-full border border-white/25
                    text-white transition-all duration-200
                    hover:-translate-y-1 hover:border-mis-gold
                    hover:bg-mis-gold hover:text-mis-navy
                  "
                >
                  <Icon size={19} />
                </a>
              ))}

            </div>
          </div>

        </div>

        {/* NAVIGATION AND QUICK LINKS */}
        <div>
          <h3 className="mb-4 border-b border-white/10 pb-2 text-base font-bold uppercase tracking-wider text-white">
            Navigation & Links
          </h3>

          <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300 sm:text-sm">

            {footerLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 transition-colors hover:text-white ${
                      isActive
                        ? 'font-bold text-mis-gold'
                        : ''
                    }`
                  }
                >
                  <span className="text-xs text-mis-gold">
                    •
                  </span>

                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}

          </ul>
        </div>

        {/* SCHOOL INFORMATION AND NEWSLETTER */}
        <div className="space-y-4">

          <h3 className="mb-4 border-b border-white/10 pb-2 text-base font-bold uppercase tracking-wider text-white">
            School Information
          </h3>

          {/* SCHOOL INFORMATION */}
          <div className="space-y-1.5 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs sm:text-sm">

            <p>
              <span className="font-bold text-white">
                UDISE Code:
              </span>{' '}
              <span className="font-mono text-mis-gold-soft">
                27280101009
              </span>
            </p>

            <p>
              <span className="font-bold text-white">
                Pattern:
              </span>{' '}
              ICSE Pattern
            </p>

            <p>
              <span className="font-bold text-white">
                Affiliation:
              </span>{' '}
              CISCE Curriculum
            </p>

            <p>
              <span className="font-bold text-white">
                Grades:
              </span>{' '}
              Nursery to 8th Grade
            </p>

          </div>

          {/* ANNOUNCEMENT SUBSCRIPTION */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">

            <p className="mb-2 text-xs font-bold text-white">
              Subscribe to Announcements
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) =>
                  setNewsletterEmail(e.target.value)
                }
                placeholder="Enter parent email"
                className="w-full min-w-0 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white outline-none placeholder:text-slate-400 focus:border-mis-gold"
              />

              <button
                type="submit"
                className="shrink-0 rounded-xl bg-mis-gold p-2.5 font-bold text-mis-navy transition-colors hover:bg-amber-400"
                aria-label="Request school announcements"
                title="Request school announcements by email"
              >
                <Send size={15} />
              </button>
            </form>

            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Opens your email app to request announcements
              from the school.
            </p>

          </div>
        </div>

      </div>

      {/* COPYRIGHT BAR */}
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">

        © {new Date().getFullYear()} Manjara International School.
        All Rights Reserved. Designed By{' '}

        <span className="font-semibold text-white">
          Dhruti Mahadik
        </span>.

      </div>

    </footer>
  );
};

export default Footer;
