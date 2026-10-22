import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import { imageAssets } from '../../data/images.js';

const newsItems = [
  { title: 'Latest News', category: 'Announcement', description: 'School updates and milestones will be published here as new information becomes available.', image: imageAssets.newsandevents[1] },
  { title: 'Upcoming Events', category: 'Events', description: 'Calendar updates and event highlights will be shared once official details are confirmed.', image: imageAssets.newsandevents[0] },
  { title: 'Community Highlights', category: 'Community', description: 'Stories that celebrate student life, parent engagement, and school growth will be showcased here.', image: imageAssets.newsandevents[2] },
];

const NewsPage = () => {
  return (
    <>
      <Helmet><title>News & Events | Manjara International School</title></Helmet>
      <PageHero title="News & Events" subtitle="A dedicated space for school updates, announcements, and upcoming highlights." backgroundImage={imageAssets.news[0]} breadcrumb={['News & Events']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {newsItems.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#245B8F]">{item.category}</p>
                  <h3 className="mt-3 text-xl font-semibold text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsPage;
