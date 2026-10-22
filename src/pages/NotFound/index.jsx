import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <Helmet>
        <title>404 | Manjara International School</title>
      </Helmet>
      <h1 className="text-6xl font-semibold text-primary">404</h1>
      <p className="mt-4 text-xl text-slate-600">The page you are looking for could not be found.</p>
      <Link to="/" className="mt-8 rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90">
        Back to Home
      </Link>
    </section>
  );
};

export default NotFoundPage;
