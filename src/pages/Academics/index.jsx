import { Helmet } from 'react-helmet-async';

const AcademicsPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>Academics | Manjara International School</title>
      </Helmet>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl">Academics</h1>
        <p className="text-lg text-slate-600">This placeholder page is ready for curriculum, programs, and learning philosophy content.</p>
      </div>
    </section>
  );
};

export default AcademicsPage;
