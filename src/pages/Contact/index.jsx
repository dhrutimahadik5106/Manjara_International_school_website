import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import EnquiryForm from '../../components/common/EnquiryForm.jsx';
import { imageAssets } from '../../data/images.js';

const ContactPage = () => {
  return (
    <>
      <Helmet><title>Contact | Manjara International School</title></Helmet>
      <PageHero title="Contact Us" subtitle="We welcome your enquiries and would be glad to assist with the next step for your child’s journey." backgroundImage={imageAssets.schoolCampus} breadcrumb={['Contact']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Get in touch</p>
              <h2 className="mt-3 text-3xl font-semibold text-primary">Manjara International School</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Khadgaon-Pakharsangvi Road, Latur</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">+91 9175518919</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">+91 9130722285</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">+91 8830005678</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">manjaraschool@gmail.com</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-[#EAF3F8] p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Map</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">A Google Maps placeholder will be inserted here when the school shares the official location link.</p>
            </div>
          </div>
          <EnquiryForm title="Send an enquiry" description="Share a few details and our team will contact you with the right guidance." />
        </div>
      </section>
    </>
  );
};

export default ContactPage;
