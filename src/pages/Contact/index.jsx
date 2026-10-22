
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import EnquiryForm from '../../components/common/EnquiryForm.jsx';
import { imageAssets } from '../../data/images.js';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Map,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const SCHOOL_PHONE = '+91 9175518919';
const SCHOOL_EMAIL = 'manjaraschool@gmail.com';

const SCHOOL_MAP_URL =
  'https://maps.app.goo.gl/BAqk1zw3qpHaC3oXA';

const WHATSAPP_MESSAGE =
  'Hello Manjara International School, I would like to enquire about admission for my child. Please share the admission process, available classes and fee details. Thank you.';

const WHATSAPP_URL =
  `https://wa.me/919175518919?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

// Search-based embedded map.
// The official shared Google Maps link is used for directions.
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=' +
  encodeURIComponent(
    'Manjara International School, Khadgaon Pakharsangvi Road, Latur'
  ) +
  '&output=embed';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Contact | Manjara International School
        </title>
        <meta
          name="description"
          content="Contact Manjara International School in Latur for admission enquiries, WhatsApp assistance, email and directions."
        />
      </Helmet>

      <PageHero
        title="Contact Us"
        subtitle="We welcome your enquiries and would be glad to assist with the next step for your child’s journey."
        backgroundImage={imageAssets.contactus}
        breadcrumb={['Contact']}
      />

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">

            {/* LEFT: CONTACT DETAILS */}
            <div className="space-y-6 lg:col-span-5">

              <div className="card-surface border border-slate-200/90 bg-white p-6 sm:p-8">

                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-mis-blue/15 bg-mis-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-mis-blue-dark">
                  <Sparkles
                    size={14}
                    className="text-mis-gold"
                  />
                  Get in touch
                </span>

                <h2 className="text-2xl font-extrabold text-mis-navy">
                  Manjara International School
                </h2>

                <div className="mt-6 space-y-4 text-xs text-slate-700 sm:text-sm">

                  {/* ADDRESS */}
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-mis-gold"
                    />

                    <div>
                      <span className="block text-xs font-bold text-mis-navy">
                        School Address
                      </span>

                      <p className="mt-1">
                        Khadgaon–Pakharsangvi Road, Latur
                      </p>

                      <a
                        href={SCHOOL_MAP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 font-semibold text-mis-blue hover:underline"
                      >
                        View School Location
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>

                  {/* PHONE */}
                  
{/* ADMISSION HELPLINE */}
<div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
  <Phone
    size={18}
    className="mt-0.5 shrink-0 text-mis-gold"
  />

  <div>
    <span className="block text-xs font-bold text-mis-navy">
      Admission Helplines
    </span>

    <div className="mt-2 flex flex-col gap-2">
      <a
        href="tel:+919175518919"
        className="font-semibold text-slate-700 transition-colors hover:text-mis-blue"
      >
        +91 9175518919
      </a>

      <a
        href="tel:+919130722285"
        className="font-semibold text-slate-700 transition-colors hover:text-mis-blue"
      >
        +91 9130722285
      </a>

      <a
        href="tel:+918830005678"
        className="font-semibold text-slate-700 transition-colors hover:text-mis-blue"
      >
        +91 8830005678
      </a>
    </div>
  </div>
</div>


                  {/* EMAIL */}
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-mis-gold"
                    />

                    <div>
                      <span className="block text-xs font-bold text-mis-navy">
                        Official Email
                      </span>

                      <a
                        href={`mailto:${SCHOOL_EMAIL}`}
                        className="mt-1 block break-all font-semibold hover:text-mis-blue"
                      >
                        {SCHOOL_EMAIL}
                      </a>
                    </div>
                  </div>

                  {/* WHATSAPP */}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-100"
                  >
                    <MessageCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-[#25D366]"
                    />

                    <div>
                      <span className="block text-xs font-bold text-emerald-900">
                        WhatsApp Admission Support
                      </span>

                      <span className="mt-1 block font-bold text-emerald-700">
                        Enquire on WhatsApp: {SCHOOL_PHONE}
                      </span>

                      <span className="mt-1 block text-xs text-emerald-700">
                        Tap to send an admission enquiry
                      </span>
                    </div>
                  </a>

                </div>
              </div>

              {/* GOOGLE MAP */}
              <div className="card-surface border border-mis-blue/20 bg-mis-soft/60 p-5 sm:p-6">

                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mis-navy">
                  <Map
                    size={17}
                    className="text-mis-gold"
                  />
                  Find Us on Google Maps
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <iframe
                    title="Manjara International School Location"
                    src={MAP_EMBED_URL}
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <a
                  href={SCHOOL_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-mis-navy px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-mis-blue"
                >
                  <MapPin size={17} />
                  Open Exact Location in Google Maps
                  <ExternalLink size={15} />
                </a>

              </div>
            </div>

            {/* RIGHT: ENQUIRY FORM */}
            <div className="lg:col-span-7">
              <EnquiryForm
                title="Send an enquiry"
                description="Share a few details and our team will contact you with the right guidance."
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
