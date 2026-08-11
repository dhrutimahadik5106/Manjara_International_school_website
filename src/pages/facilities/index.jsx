import { Helmet } from 'react-helmet-async';

const FacilitiesPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>Facilities | Manjara International School</title>
      </Helmet>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl">Facilities</h1>
        <p className="text-lg text-slate-600">This placeholder page is designed for campus resources, labs, sports, and student amenities.</p>
      </div>
    </section>
  );
};

export default FacilitiesPage;
