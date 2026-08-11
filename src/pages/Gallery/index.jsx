import { Helmet } from 'react-helmet-async';

const GalleryPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>Gallery | Manjara International School</title>
      </Helmet>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl">Gallery</h1>
        <p className="text-lg text-slate-600">This space is ready for visual storytelling and media collections.</p>
      </div>
    </section>
  );
};

export default GalleryPage;
