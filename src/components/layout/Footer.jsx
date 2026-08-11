import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react';

const footerLinks = [
  { label: 'Admissions', href: '#admissions' },
  { label: 'Academics', href: '#academics' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#203b53] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.7fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <div>
            <p className="text-lg font-semibold text-white">Manjara International School</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">A premium learning environment that combines academic excellence, caring mentorship, and purposeful growth.</p>
          </div>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, index) => (
              <a key={index} href="#" className="rounded-full border border-white/15 bg-white/10 p-3 transition hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/30">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {footerLinks.map((link) => (
              <li key={link.label}><a href={link.href} className="transition hover:text-white">{link.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Stay Connected</h3>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <MapPin size={16} className="text-accent" />
            <span>Manjara Campus, Sector 12, Near City Road</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Phone size={16} className="text-accent" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Mail size={16} className="text-accent" />
            <span>admissions@manjara.in</span>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.4)]">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
              <span>Newsletter Signup</span>
              <Send size={16} className="text-accent" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2">
              <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Email address" />
              <button className="rounded-full bg-secondary p-2 text-white transition hover:scale-105"><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        © 2026 Manjara International School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
