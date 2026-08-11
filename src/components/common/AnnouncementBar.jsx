import { useEffect, useState } from 'react';
import { ArrowRight, X, Mail, Phone, Download } from 'lucide-react';

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = window.localStorage.getItem('announcement-dismissed');
    if (dismissed === 'true') setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-white/15 bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="inline-flex items-center gap-2 font-medium transition hover:text-accent">
            <Download size={16} /> Download Brochure
          </a>
          <a href="tel:+919876543210" className="inline-flex items-center gap-2 transition hover:text-accent">
            <Phone size={16} /> +91 98765 43210
          </a>
          <a href="mailto:admissions@manjara.in" className="inline-flex items-center gap-2 transition hover:text-accent">
            <Mail size={16} /> admissions@manjara.in
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="transition hover:text-accent">Instagram</a>
          <a href="#" className="transition hover:text-accent">Facebook</a>
          <button onClick={() => { setVisible(false); window.localStorage.setItem('announcement-dismissed', 'true'); }} className="rounded-full p-1 transition hover:bg-white/10" aria-label="Dismiss announcement">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
