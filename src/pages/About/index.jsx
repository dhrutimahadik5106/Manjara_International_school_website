import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>About | Manjara International School</title>
      </Helmet>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl">About Us</h1>
        <p className="text-lg text-slate-600">This page is prepared as an architectural placeholder for mission, vision, and heritage content.</p>
      </div>
    </section>
  );
};

export default AboutPage;
