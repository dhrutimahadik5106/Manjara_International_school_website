import { Helmet } from 'react-helmet-async';

const AdminPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin | Manjara International School</title>
      </Helmet>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl">Admin Dashboard</h1>
        <p className="text-lg text-slate-600">This placeholder route is set up for future protected admin experiences and Supabase-powered content management.</p>
      </div>
    </section>
  );
};

export default AdminPage;
