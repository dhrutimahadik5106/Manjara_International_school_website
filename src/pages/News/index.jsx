import { Helmet } from 'react-helmet-async';

const NewsPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>News & Events | Manjara International School</title>
      </Helmet>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl">News & Events</h1>
        <p className="text-lg text-slate-600">This placeholder page is prepared for announcements, calendars, and recent highlights.</p>
      </div>
    </section>
  );
};

export default NewsPage;
