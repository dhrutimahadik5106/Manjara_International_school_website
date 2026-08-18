import EnquiryForm from '../common/EnquiryForm.jsx';

const EnquirySection = () => {
  return (
    <section className="bg-[#EAF3F8] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Admission Open</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Nursery to 8th Grade</h2>
          <p className="text-lg leading-8 text-slate-700">Begin your child’s journey with a school that balances academic excellence, values, and personal growth in a calm and inspiring environment.</p>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#245B8F]">Why families connect with us</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li>• Calm, nature-rich campus environment</li>
              <li>• Balanced academic and co-curricular learning</li>
              <li>• Student-focused support and guided growth</li>
            </ul>
          </div>
        </div>
        <EnquiryForm title="Send an Enquiry" description="Share a few details and our team will reach out with the right guidance and next steps." />
      </div>
    </section>
  );
};

export default EnquirySection;
