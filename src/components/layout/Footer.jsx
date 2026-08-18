import { Mail, MapPin, Phone, Send } from 'lucide-react';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Why Manjara', href: '/why-manjara/curriculum' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'News & Events', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Contact Us', href: '/contact' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#0B2942] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.7fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <div>
            <p className="text-lg font-semibold text-white">Manjara International School</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">Rising Towards Excellence — a premium, future-ready learning environment rooted in care, character, and academic depth.</p>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <p className="flex items-start gap-3"><MapPin size={16} className="mt-1 text-[#C7A45D]" /> Khadgaon-Pakharsangvi Road, Latur</p>
            <p className="flex items-center gap-3"><Phone size={16} className="text-[#C7A45D]" /> +91 9175518919</p>
            <p className="flex items-center gap-3"><Phone size={16} className="text-[#C7A45D]" /> +91 9130722285</p>
            <p className="flex items-center gap-3"><Phone size={16} className="text-[#C7A45D]" /> +91 8830005678</p>
            <p className="flex items-center gap-3"><Mail size={16} className="text-[#C7A45D]" /> manjaraschool@gmail.com</p>
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
          <h3 className="text-lg font-semibold text-white">Photo Gallery</h3>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 text-sm leading-7 text-slate-300">
            <p><span className="font-semibold text-white">UDISE:</span> 27280101009</p>
            <p><span className="font-semibold text-white">Curriculum:</span> ICSE pattern</p>
            <p><span className="font-semibold text-white">Affiliation:</span> CISCE</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">Newsletter</p>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
              <input placeholder="Email Address" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
              <button className="rounded-full bg-[#C7A45D] p-2 text-[#123B5D]" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
        © MIS, All Right Reserved. Designed By Sandesh Bellale.
      </div>
    </footer>
  );
};

export default Footer;
