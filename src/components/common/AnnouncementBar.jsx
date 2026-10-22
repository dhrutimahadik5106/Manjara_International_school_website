
import { useEffect, useState } from 'react';
import { X, Mail, Phone, Download } from 'lucide-react';

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(
      'announcement-dismissed'
    );

    if (dismissed === 'true') {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-white/15 bg-[#0B2942] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

        <div className="flex flex-wrap items-center gap-4">

          {/* Download Admission Brochure */}
          <a
            href="/brochures/MIS-Admission-Brochure.jpeg"
            download="Manjara-International-School-Brochure.jpeg"
            className="inline-flex items-center gap-2 font-medium transition hover:text-[#C7A45D]"
          >
            <Download size={16} />
            Download Brochure
          </a>

          {/* Open School WhatsApp */}
          <a
            href="https://wa.me/919175518919"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-green-300"
            aria-label="Contact Manjara International School on WhatsApp"
          >
            <Phone size={16} />
            +91 9175518919
          </a>

          {/* Open Email */}
          <a
            href="mailto:manjaraschool@gmail.com"
            className="inline-flex items-center gap-2 transition hover:text-[#C7A45D]"
          >
            <Mail size={16} />
            manjaraschool@gmail.com
          </a>

        </div>

        {/* Close Announcement Bar */}
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            window.localStorage.setItem(
              'announcement-dismissed',
              'true'
            );
          }}
          className="rounded-full p-1 transition hover:bg-white/10"
          aria-label="Dismiss announcement"
        >
          <X size={16} />
        </button>

      </div>
    </div>
  );
};

export default AnnouncementBar;
